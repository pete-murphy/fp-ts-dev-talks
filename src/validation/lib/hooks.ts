import { ChangeEventHandler, useState } from "react"

export const useInput = (
  initialValue: string,
): [string, ChangeEventHandler<HTMLInputElement>] => {
  const [value, setValue] = useState(initialValue)
  const onChange: ChangeEventHandler<HTMLInputElement> = e => {
    setValue(e.currentTarget.value)
  }
  return [value, onChange]
}
