import { Toaster as Sonner, type ToasterProps } from "sonner";

/** App-wide toast outlet. Mounted once in the root layout; fire toasts with `toast()` from "sonner". */
export function Toaster(props: ToasterProps) {
  return <Sonner position="bottom-right" richColors closeButton {...props} />;
}
