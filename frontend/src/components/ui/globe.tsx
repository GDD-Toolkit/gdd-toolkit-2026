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
const EMPTY_REGION_NAMES: readonly string[] = []

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
  selectedRegions?: readonly string[]
  selectedCountries?: readonly string[]
  focusCountry?: string | null
  onCountriesLoaded?: (countries: GlobeCountry[]) => void
  onCountryHover?: (country: string | null) => void
  onCountryClick?: (country: string) => void
  width?: number
  height?: number
  className?: string
}

export default function RotatingEarth({ width = 800, height = 600, className = "", regions = EMPTY_REGIONS, selectedRegions = EMPTY_REGION_NAMES, selectedCountries = EMPTY_COUNTRIES, focusCountry = null, onCountriesLoaded, onCountryHover, onCountryClick }: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const regionsRef = useRef(regions)
  const selectedRegionsRef = useRef(new Set(selectedRegions))
  const renderRef = useRef<(() => void) | null>(null)
  const focusCountryRef = useRef(focusCountry)
  const centerCountryRef = useRef<(() => void) | null>(null)
  const selectedCountriesRef = useRef(new Set(selectedCountries))
  const onCountriesLoadedRef = useRef(onCountriesLoaded)
  const onCountryHoverRef = useRef(onCountryHover)
  const onCountryClickRef = useRef(onCountryClick)

  useEffect(() => {
    onCountryClickRef.current = onCountryClick
  }, [onCountryClick])

  useEffect(() => {
    onCountryHoverRef.current = onCountryHover
  }, [onCountryHover])

  useEffect(() => {
    onCountriesLoadedRef.current = onCountriesLoaded
  }, [onCountriesLoaded])

  // Selection highlighting and requested camera movement are independent.
  useEffect(() => {
    selectedCountriesRef.current = new Set(selectedCountries)
    renderRef.current?.()
  }, [selectedCountries])

  useEffect(() => {
    focusCountryRef.current = focusCountry
    centerCountryRef.current?.()
  }, [focusCountry])

  useEffect(() => {
    selectedRegionsRef.current = new Set(selectedRegions)
    renderRef.current?.()
  }, [selectedRegions])

  useEffect(() => {
    regionsRef.current = regions
    renderRef.current?.()
  }, [regions])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    // Mobile uses the full available width and a square drawing surface.
    const getDimensions = () => {
      const mobile = window.innerWidth < 1024
      const availableWidth = canvas.parentElement?.getBoundingClientRect().width ?? window.innerWidth - 40
      const nextWidth = Math.max(1, Math.min(width, mobile ? availableWidth : window.innerWidth - 40))
      return {
        width: nextWidth,
        height: mobile ? nextWidth : Math.max(1, Math.min(height, window.innerHeight - 100)),
        mobile,
      }
    }
    const initialDimensions = getDimensions()
    let containerWidth = initialDimensions.width
    let containerHeight = initialDimensions.height
    let radius = Math.min(containerWidth, containerHeight) / 2.5
    let dpr = window.devicePixelRatio || 1
    let mobile = initialDimensions.mobile
    const sizeCanvas = () => {
      canvas.width = Math.round(containerWidth * dpr)
      canvas.height = Math.round(containerHeight * dpr)
      canvas.style.width = `${containerWidth}px`
      canvas.style.height = mobile ? "auto" : `${containerHeight}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    sizeCanvas()

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
    let hoverPosition: { x: number; y: number } | null = null
    let hoveredCountry: string | null = null
    const countryAtPosition = (position: { x: number; y: number }) => {
      let country: string | null = null
      if (landFeatures) {
        const bounds = canvas.getBoundingClientRect()
        const x = (position.x - bounds.left) * containerWidth / bounds.width
        const y = (position.y - bounds.top) * containerHeight / bounds.height
        const [centerX, centerY] = projection.translate()
        if (x >= 0 && x <= containerWidth && y >= 0 && y <= containerHeight
          && Math.hypot(x - centerX, y - centerY) <= projection.scale()) {
          const coordinates = projection.invert?.([x, y])
          if (coordinates) {
            country = landFeatures.features.find(
              (feature: d3.GeoPermissibleObjects & { properties: CountryProperties }) =>
                d3.geoContains(feature, coordinates),
            )?.properties.ADMIN ?? null
          }
        }
      }
      return country
    }
    const updateHoveredCountry = () => {
      const country = hoverPosition && onCountryHoverRef.current ? countryAtPosition(hoverPosition) : null
      if (country !== hoveredCountry) {
        hoveredCountry = country
        onCountryHoverRef.current?.(country)
      }
    }
    const clearHoveredCountry = () => {
      hoverPosition = null
      updateHoveredCountry()
    }

    const regionForCountry = (properties: DotData["properties"]) =>
      regionsRef.current.find((region) =>
        region.worldBankRegion !== undefined
          ? region.worldBankRegion === properties.REGION_WB
          :
        (region.continent !== undefined && region.continent === properties.CONTINENT) ||
        (region.subregions ?? [region.name]).includes(properties.SUBREGION ?? "")
      )
    const regionColor = (properties: DotData["properties"]) => regionForCountry(properties)?.color
    const countryHighlighted = (properties: CountryProperties) => {
      if (selectedCountriesRef.current.size > 0) return selectedCountriesRef.current.has(properties.ADMIN)
      if (selectedRegionsRef.current.size === 0) return true
      const region = regionForCountry(properties)
      return region !== undefined && selectedRegionsRef.current.has(region.name)
    }

    const render = () => {
      // Clear canvas
      context.clearRect(0, 0, containerWidth, containerHeight)

      const currentScale = projection.scale()
      const scaleFactor = currentScale / radius

      // Draw ocean (globe background)
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
      context.fillStyle = "#87CEEB"
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
            : countryHighlighted(feature.properties) ? 0.35 : 0.12
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
            context.globalAlpha = countryHighlighted(dot.properties) ? 1 : 0.35
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
      // Recheck a stationary pointer as the globe rotates or zooms underneath it.
      updateHoveredCountry()
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

        centerCountryRef.current?.()
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
    let clickCandidate: { id: number; x: number; y: number } | null = null
    let resumeAt = performance.now() + 2000
    let previousElapsed = 0
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let focusTransition: {
      startedAt: number
      from: [number, number]
      delta: [number, number]
    } | null = null
    const pauseRotation = () => {
      resumeAt = performance.now() + 2000
    }
    const centerCountry = () => {
      focusTransition = null
      if (!focusCountryRef.current || !landFeatures) return
      const feature = landFeatures.features.find(
        (feature: { properties: CountryProperties }) => feature.properties.ADMIN === focusCountryRef.current,
      )
      if (!feature) return
      const [longitude, latitude] = d3.geoCentroid(feature)
      if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return
      // Explicit country navigation always animates, including when idle rotation is disabled.
      const longitudeDelta = ((-longitude - rotation[0]) % 360 + 540) % 360 - 180
      focusTransition = {
        startedAt: performance.now(),
        from: [...rotation],
        delta: [longitudeDelta, -latitude - rotation[1]],
      }
      pauseRotation()
    }
    centerCountryRef.current = centerCountry
    const zoom = (factor: number) => {
      focusTransition = null
      projection.scale(Math.max(radius * 0.5, Math.min(radius * 3, projection.scale() * factor)))
      pauseRotation()
      render()
    }
    const rotateBy = (dx: number, dy: number) => {
      focusTransition = null
      rotation[0] = (rotation[0] + dx) % 360
      rotation[1] = Math.max(-90, Math.min(90, rotation[1] + dy))
      projection.rotate(rotation)
      render()
    }
    const rotationTimer = d3.timer((elapsed) => {
      const delta = Math.min(elapsed - previousElapsed, 50)
      previousElapsed = elapsed
      if (focusTransition) {
        const progress = Math.min(1, (performance.now() - focusTransition.startedAt) / 1000)
        const eased = d3.easeCubicInOut(progress)
        rotation[0] = (focusTransition.from[0] + focusTransition.delta[0] * eased) % 360
        rotation[1] = focusTransition.from[1] + focusTransition.delta[1] * eased
        projection.rotate(rotation)
        render()
        if (progress === 1) {
          focusTransition = null
          pauseRotation()
        }
      } else if (!reducedMotion && pointers.size === 0 && performance.now() >= resumeAt) {
        rotateBy(delta * 0.015, 0)
      }
    })

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      focusTransition = null
      hoverPosition = { x: event.clientX, y: event.clientY }
      updateHoveredCountry()
      canvas.setPointerCapture(event.pointerId)
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
      clickCandidate = pointers.size === 1
        ? { id: event.pointerId, x: event.clientX, y: event.clientY }
        : null
      canvas.style.cursor = "grabbing"
      canvas.focus({ preventScroll: true })
      pauseRotation()
    }
    const handlePointerMove = (event: PointerEvent) => {
      hoverPosition = { x: event.clientX, y: event.clientY }
      updateHoveredCountry()
      const previous = pointers.get(event.pointerId)
      if (!previous) return
      const next = { x: event.clientX, y: event.clientY }
      if (clickCandidate && Math.hypot(next.x - clickCandidate.x, next.y - clickCandidate.y) > 5) {
        clickCandidate = null
      }
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
      const isClick = event.type === "pointerup" && clickCandidate?.id === event.pointerId
        && Math.hypot(event.clientX - clickCandidate.x, event.clientY - clickCandidate.y) <= 5
      clickCandidate = null
      pointers.delete(event.pointerId)
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
      if (pointers.size === 0) canvas.style.cursor = "grab"
      pauseRotation()
      if (isClick) {
        const country = countryAtPosition({ x: event.clientX, y: event.clientY })
        if (country) onCountryClickRef.current?.(country)
      }
    }
    const handleWheel = (event: WheelEvent) => {
      clickCandidate = null
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

    const resizeCanvas = () => {
      const dimensions = getDimensions()
      const nextDpr = window.devicePixelRatio || 1
      if (dimensions.width === containerWidth && dimensions.height === containerHeight
        && dimensions.mobile === mobile && nextDpr === dpr) return
      const zoomFactor = projection.scale() / radius
      containerWidth = dimensions.width
      containerHeight = dimensions.height
      mobile = dimensions.mobile
      dpr = nextDpr
      radius = Math.min(containerWidth, containerHeight) / 2.5
      sizeCanvas()
      projection.translate([containerWidth / 2, containerHeight / 2]).scale(radius * zoomFactor)
      render()
    }
    const resizeObserver = new ResizeObserver(resizeCanvas)
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement)
    window.addEventListener("resize", resizeCanvas)

    canvas.addEventListener("pointerdown", handlePointerDown)
    canvas.addEventListener("pointermove", handlePointerMove)
    canvas.addEventListener("pointerleave", clearHoveredCountry)
    canvas.addEventListener("pointercancel", clearHoveredCountry)
    canvas.addEventListener("pointerup", handlePointerEnd)
    canvas.addEventListener("pointercancel", handlePointerEnd)
    canvas.addEventListener("lostpointercapture", handlePointerEnd)
    canvas.addEventListener("wheel", handleWheel, { passive: false })
    canvas.addEventListener("keydown", handleKeyDown)
    loadWorldData()

    return () => {
      renderRef.current = null
      centerCountryRef.current = null
      controller.abort()
      rotationTimer.stop()
      resizeObserver.disconnect()
      window.removeEventListener("resize", resizeCanvas)
      clearHoveredCountry()
      canvas.removeEventListener("pointerdown", handlePointerDown)
      canvas.removeEventListener("pointermove", handlePointerMove)
      canvas.removeEventListener("pointerleave", clearHoveredCountry)
      canvas.removeEventListener("pointercancel", clearHoveredCountry)
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
        aria-label={`Interactive globe.${onCountryClick ? " Click or tap a country to view its details." : ""} Drag to rotate, pinch or scroll to zoom. Arrow keys rotate, plus and minus zoom, Home resets.`}
        style={{ maxWidth: "100%", height: "auto", touchAction: "none", cursor: "grab" }}
      />
      {isLoading && <p role="status" className="absolute top-4 left-4 text-sm">Loading globe...</p>}
      <p className="mt-3 text-sm text-muted-foreground">
        Drag to rotate. Pinch or scroll to zoom. Arrow keys to rotate. +/- to zoom. Home to reset.
      </p>
    </div>
  )
}
