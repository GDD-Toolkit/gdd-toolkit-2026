"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

export interface GlobeRegion {
  name: string
  color: string
  /** Preferred viewing center as [longitude, latitude]. */
  center?: readonly [number, number]
  worldBankRegion?: string
  subregions?: readonly string[]
  continent?: string
}

const EMPTY_REGIONS: readonly GlobeRegion[] = []
const EMPTY_COUNTRIES: readonly string[] = []

export interface GlobeCountry {
  name: string
  worldBankRegion: string
}

interface CountryProperties {
  ADMIN: string
  SUBREGION?: string
  CONTINENT?: string
  REGION_WB: string
}

interface RotatingEarthProps {
  regions?: readonly GlobeRegion[]
  focusCenter?: readonly [number, number] | null
  selectedCountries?: readonly string[]
  onCountriesLoaded?: (countries: GlobeCountry[]) => void
  width?: number
  height?: number
  className?: string
}

export default function RotatingEarth({ width = 800, height = 600, className = "", regions = EMPTY_REGIONS, focusCenter = null, selectedCountries = EMPTY_COUNTRIES, onCountriesLoaded }: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const regionsRef = useRef(regions)
  const renderRef = useRef<(() => void) | null>(null)
  const focusRef = useRef(focusCenter)
  const focusGlobeRef = useRef<(() => void) | null>(null)
  const selectedCountriesRef = useRef(new Set(selectedCountries))
  const onCountriesLoadedRef = useRef(onCountriesLoaded)

  useEffect(() => {
    onCountriesLoadedRef.current = onCountriesLoaded
  }, [onCountriesLoaded])

  // Country changes only redraw; they never change the projection or zoom.
  useEffect(() => {
    selectedCountriesRef.current = new Set(selectedCountries)
    renderRef.current?.()
  }, [selectedCountries])

  useEffect(() => {
    focusRef.current = focusCenter
    focusGlobeRef.current?.()
  }, [focusCenter])

  useEffect(() => {
    regionsRef.current = regions
    renderRef.current?.()
  }, [regions])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    // Set up responsive dimensions
    const containerWidth = Math.min(width, window.innerWidth - 40)
    const containerHeight = Math.min(height, window.innerHeight - 100)
    const radius = Math.min(containerWidth, containerHeight) / 2.5

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`
    context.scale(dpr, dpr)

    // Create projection and path generator for Canvas
    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point
      let inside = false

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i]
        const [xj, yj] = polygon[j]

        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside
        }
      }

      return inside
    }

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry

      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates
        // Check if point is in outer ring
        if (!pointInPolygon(point, coordinates[0])) {
          return false
        }
        // Check if point is in any hole (inner rings)
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) {
            return false // Point is in a hole
          }
        }
        return true
      } else if (geometry.type === "MultiPolygon") {
        // Check each polygon in the MultiPolygon
        for (const polygon of geometry.coordinates) {
          // Check if point is in outer ring
          if (pointInPolygon(point, polygon[0])) {
            // Check if point is in any hole
            let inHole = false
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true
                break
              }
            }
            if (!inHole) {
              return true
            }
          }
        }
        return false
      }

      return false
    }

    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = []
      const bounds = d3.geoBounds(feature)
      const [[west, minLat], [east, maxLat]] = bounds
      // A wrapped bound crosses the antimeridian.
      const minLng = west > east ? -180 : west
      const maxLng = west > east ? 180 : east

      const stepSize = dotSpacing * 0.08
      let pointsGenerated = 0

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat]
          if (pointInFeature(point, feature)) {
            dots.push(point)
            pointsGenerated++
          }
        }
      }

      console.log(
        `[v0] Generated ${pointsGenerated} points for land feature:`,
        feature.properties?.featurecla || "Land",
      )
      return dots
    }

    interface DotData {
      lng: number
      lat: number
      properties: CountryProperties
    }

    const allDots: DotData[] = []
    let landFeatures: any

    const regionColor = (properties: DotData["properties"]) =>
      regionsRef.current.find((region) =>
        region.worldBankRegion !== undefined
          ? region.worldBankRegion === properties.REGION_WB
          :
        (region.continent !== undefined && region.continent === properties.CONTINENT) ||
        (region.subregions ?? [region.name]).includes(properties.SUBREGION ?? "")
      )?.color

    const render = () => {
      // Clear canvas
      context.clearRect(0, 0, containerWidth, containerHeight)

      const currentScale = projection.scale()
      const scaleFactor = currentScale / radius

      // Draw ocean (globe background)
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
      context.fillStyle = "#000000"
      context.fill()
      context.strokeStyle = "#ffffff"
      context.lineWidth = 2 * scaleFactor
      context.stroke()

      if (landFeatures) {
        // Draw graticule
        const graticule = d3.geoGraticule()
        context.beginPath()
        path(graticule())
        context.strokeStyle = "#ffffff"
        context.lineWidth = 1 * scaleFactor
        context.globalAlpha = 0.25
        context.stroke()
        context.globalAlpha = 1

        // Apply the page's region colors to the matching countries.
        landFeatures.features.forEach((feature: any) => {
          const color = regionColor(feature.properties)
          if (!color) return
          context.beginPath()
          path(feature)
          context.fillStyle = color
          context.globalAlpha = selectedCountriesRef.current.has(feature.properties.ADMIN)
            ? 0.85
            : selectedCountriesRef.current.size > 0 ? 0.12 : 0.35
          context.fill()
          context.globalAlpha = 1
        })

        // Draw land outlines
        context.beginPath()
        landFeatures.features.forEach((feature: any) => {
          path(feature)
        })
        context.strokeStyle = "#ffffff"
        context.lineWidth = 1 * scaleFactor
        context.stroke()

        // Draw halftone dots
        const center = projection.invert?.([containerWidth / 2, containerHeight / 2])
        allDots.forEach((dot) => {
          if (!center || d3.geoDistance([dot.lng, dot.lat], center) >= Math.PI / 2) return
          const projected = projection([dot.lng, dot.lat])
          if (
            projected &&
            projected[0] >= 0 &&
            projected[0] <= containerWidth &&
            projected[1] >= 0 &&
            projected[1] <= containerHeight
          ) {
            context.beginPath()
            context.arc(projected[0], projected[1], 1.2 * scaleFactor, 0, 2 * Math.PI)
            context.fillStyle = regionColor(dot.properties) ?? "#999999"
            context.globalAlpha = selectedCountriesRef.current.size > 0 && !selectedCountriesRef.current.has(dot.properties.ADMIN) ? 0.35 : 1
            context.fill()
            context.globalAlpha = 1
          }
        })

        // Draw selected borders last to keep the highlight visible over the dots.
        context.beginPath()
        landFeatures.features.forEach((feature: any) => {
          if (selectedCountriesRef.current.has(feature.properties.ADMIN)) path(feature)
        })
        context.strokeStyle = "#ffffff"
        context.lineWidth = 2.5 * scaleFactor
        context.stroke()
      }
    }

    renderRef.current = render
    const controller = new AbortController()
    const loadWorldData = async () => {
      try {
        setIsLoading(true)

        const response = await fetch(
          "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
          { signal: controller.signal },
        )
        if (!response.ok) throw new Error("Failed to load land data")

        landFeatures = await response.json()
        if (controller.signal.aborted) return
        // Use the same country names and World Bank assignments as the map.
        onCountriesLoadedRef.current?.(
          landFeatures.features
            .map((feature: { properties: CountryProperties }) => ({
              name: feature.properties.ADMIN,
              worldBankRegion: feature.properties.REGION_WB,
            }))
            .sort((a: GlobeCountry, b: GlobeCountry) => a.name.localeCompare(b.name)),
        )

        // Generate dots for all land features
        let totalDots = 0
        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 16)
          dots.forEach(([lng, lat]) => {
            allDots.push({ lng, lat, properties: feature.properties })
            totalDots++
          })
        })

        console.log(`[v0] Total dots generated: ${totalDots} across ${landFeatures.features.length} land features`)

        render()
        setIsLoading(false)
      } catch {
        if (controller.signal.aborted) return
        setError("Failed to load land map data")
        setIsLoading(false)
      }
    }

    // Pointer capture keeps mouse, pen, and touch gestures on the globe.
    const rotation: [number, number] = [0, 0]
    const pointers = new Map<number, { x: number; y: number }>()
    let resumeAt = 0
    let previousElapsed = 0
    let focusAnimation: {
      startedAt: number
      from: [number, number]
      to: [number, number]
    } | null = null
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const pauseRotation = () => {
      focusAnimation = null
      resumeAt = performance.now() + 2000
    }
    const zoom = (factor: number) => {
      projection.scale(Math.max(radius * 0.5, Math.min(radius * 3, projection.scale() * factor)))
      pauseRotation()
      render()
    }
    const rotateBy = (dx: number, dy: number) => {
      rotation[0] = (rotation[0] + dx) % 360
      rotation[1] = Math.max(-90, Math.min(90, rotation[1] + dy))
      projection.rotate(rotation)
      render()
    }
    const focusGlobe = () => {
      focusAnimation = null
      const center = focusRef.current
      if (!center) {
        pauseRotation()
        return
      }
      // Normalize the longitude change so the globe takes the shorter turn.
      const longitudeDelta = ((-center[0] - rotation[0]) % 360 + 540) % 360 - 180
      const target: [number, number] = [rotation[0] + longitudeDelta, -center[1]]
      if (reducedMotion) {
        rotation[0] = target[0]
        rotation[1] = target[1]
        projection.rotate(rotation)
        render()
      } else {
        focusAnimation = {
          startedAt: performance.now(),
          from: [...rotation],
          to: target,
        }
      }
    }
    focusGlobeRef.current = focusGlobe
    focusGlobe()

    const rotationTimer = d3.timer((elapsed) => {
      const delta = Math.min(elapsed - previousElapsed, 50)
      previousElapsed = elapsed
      if (focusAnimation) {
        const progress = Math.min((performance.now() - focusAnimation.startedAt) / 900, 1)
        const eased = d3.easeCubicInOut(progress)
        rotation[0] = focusAnimation.from[0] + (focusAnimation.to[0] - focusAnimation.from[0]) * eased
        rotation[1] = focusAnimation.from[1] + (focusAnimation.to[1] - focusAnimation.from[1]) * eased
        projection.rotate(rotation)
        render()
        if (progress === 1) focusAnimation = null
      } else if (!focusRef.current && !reducedMotion && pointers.size === 0 && performance.now() >= resumeAt) {
        rotateBy(delta * 0.015, 0)
      }
    })

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      canvas.setPointerCapture(event.pointerId)
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
      canvas.style.cursor = "grabbing"
      canvas.focus({ preventScroll: true })
      pauseRotation()
    }
    const handlePointerMove = (event: PointerEvent) => {
      const previous = pointers.get(event.pointerId)
      if (!previous) return
      const next = { x: event.clientX, y: event.clientY }
      if (pointers.size === 1) {
        const sensitivity = 90 / (projection.scale() * canvas.getBoundingClientRect().width / containerWidth)
        rotateBy((next.x - previous.x) * sensitivity, -(next.y - previous.y) * sensitivity)
      } else {
        const other = [...pointers.entries()].find(([id]) => id !== event.pointerId)![1]
        const oldDistance = Math.hypot(previous.x - other.x, previous.y - other.y)
        const newDistance = Math.hypot(next.x - other.x, next.y - other.y)
        if (oldDistance > 0 && newDistance > 0) zoom(newDistance / oldDistance)
      }
      pointers.set(event.pointerId, next)
      pauseRotation()
    }
    const handlePointerEnd = (event: PointerEvent) => {
      pointers.delete(event.pointerId)
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
      if (pointers.size === 0) canvas.style.cursor = "grab"
      pauseRotation()
    }
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? containerHeight : 1)
      zoom(Math.exp(-Math.max(-200, Math.min(200, delta)) * 0.002))
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft": rotateBy(-5, 0); break
        case "ArrowRight": rotateBy(5, 0); break
        case "ArrowUp": rotateBy(0, 5); break
        case "ArrowDown": rotateBy(0, -5); break
        case "+": case "=": zoom(1.15); break
        case "-": zoom(1 / 1.15); break
        case "Home":
          rotation[0] = 0
          rotation[1] = 0
          projection.scale(radius)
          rotateBy(0, 0)
          break
        default: return
      }
      event.preventDefault()
      pauseRotation()
    }

    canvas.addEventListener("pointerdown", handlePointerDown)
    canvas.addEventListener("pointermove", handlePointerMove)
    canvas.addEventListener("pointerup", handlePointerEnd)
    canvas.addEventListener("pointercancel", handlePointerEnd)
    canvas.addEventListener("lostpointercapture", handlePointerEnd)
    canvas.addEventListener("wheel", handleWheel, { passive: false })
    canvas.addEventListener("keydown", handleKeyDown)
    loadWorldData()

    return () => {
      renderRef.current = null
      focusGlobeRef.current = null
      focusAnimation = null
      controller.abort()
      rotationTimer.stop()
      canvas.removeEventListener("pointerdown", handlePointerDown)
      canvas.removeEventListener("pointermove", handlePointerMove)
      canvas.removeEventListener("pointerup", handlePointerEnd)
      canvas.removeEventListener("pointercancel", handlePointerEnd)
      canvas.removeEventListener("lostpointercapture", handlePointerEnd)
      canvas.removeEventListener("wheel", handleWheel)
      canvas.removeEventListener("keydown", handleKeyDown)
      for (const id of pointers.keys()) {
        if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id)
      }
      pointers.clear()
    }
  }, [width, height])

  if (error) {
    return (
      <div className={`dark flex items-center justify-center bg-card rounded-2xl p-8 ${className}`}>
        <div className="text-center">
          <p className="dark text-destructive font-semibold mb-2">Error loading Earth visualization</p>
          <p className="dark text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-2xl bg-background dark"
        tabIndex={0}
        aria-label="Interactive globe. Drag to rotate, pinch or scroll to zoom. Arrow keys rotate, plus and minus zoom, Home resets."
        style={{ maxWidth: "100%", height: "auto", touchAction: "none", cursor: "grab" }}
      />
      {isLoading && <p role="status" className="absolute top-4 left-4 text-sm">Loading globe...</p>}
      <p className="mt-3 text-sm text-muted-foreground">
        Drag to rotate. Pinch or scroll to zoom. Arrow keys to rotate. +/- to zoom. Home to reset.
      </p>
    </div>
  )
}
