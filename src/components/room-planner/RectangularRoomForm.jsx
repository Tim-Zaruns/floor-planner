import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

export function RectangularRoomForm({ roomIndex }) {
  const { control } = useFormContext()

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`rooms.${roomIndex}.dimensions.width`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Width (cm)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="100"
                max="2000"
                placeholder="500"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`rooms.${roomIndex}.dimensions.height`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Length (cm)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="100"
                max="2000"
                placeholder="400"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`rooms.${roomIndex}.dimensions.wallThickness`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Wall Thickness (cm)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="10"
                max="50"
                placeholder="20"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
} 