import { CSSProp } from "styled-components"

declare module "react" {
  interface SVGProps<T> extends DOMAttributes<T> {
    css?: CSSProp
  }
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSProp
  }
}
