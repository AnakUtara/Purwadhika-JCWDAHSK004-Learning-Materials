import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../shadcn-ui/field"
import { useState, type InputHTMLAttributes } from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../shadcn-ui/input-group"
import { Button } from "../shadcn-ui/button"
import { Eye, EyeClosed } from "lucide-react"

type TextFieldProps<T extends FieldValues> = {
  name: Path<T>
  label: string
  control: Control<T>
  placeholder?: string
  description?: string
  type?: InputHTMLAttributes<HTMLInputElement>["type"]
  disabled?: boolean
}

const TextField = <T extends FieldValues>({
  name,
  label,
  control,
  placeholder = "",
  description = "",
  type = "text",
  disabled = false,
}: TextFieldProps<T>) => {
  const [visibility, setVisibility] = useState<boolean>(type !== "password")
  return (
    <Controller
      {...{ name, control }}
      render={({ field, fieldState }) => {
        const { invalid, error } = fieldState
        return (
          <Field data-invalid={invalid}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <InputGroup>
              <InputGroupInput
                {...field}
                id={name}
                aria-invalid={invalid}
                type={visibility ? "text" : type}
                {...{ placeholder, disabled }}
              />

              {type === "password" ? (
                <InputGroupAddon align="inline-end">
                  <Button
                    size={"icon-sm"}
                    onClick={() => setVisibility(!visibility)}
                  >
                    {visibility ? <Eye /> : <EyeClosed />}
                  </Button>
                </InputGroupAddon>
              ) : null}
            </InputGroup>

            {invalid && <FieldError errors={[error]} />}

            {description ? (
              <FieldDescription>{description}</FieldDescription>
            ) : null}
          </Field>
        )
      }}
    />
  )
}

export default TextField
