import { Form } from '@/components/form'
import { Button } from '@shadcn/ui/button'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { createFeatureSchema, TCreateFeatureInput } from '@/resources/features'
import { FormLayout } from '@/components/form/form-layout'

interface FeatureFormProps {
  defaultValues: TCreateFeatureInput
  onSubmit: (data: TCreateFeatureInput) => void | Promise<void>
  submitLabel?: string
  onCancel?: () => void
}

function FeatureFormFields() {
  return (
    <>
      <Form.Input field="key" label="Key" placeholder="Enter feature key" autoFocus required />

      <Form.Textarea
        field="description"
        label="Description"
        placeholder="Enter description"
        rows={4}
      />
    </>
  )
}

export function FeatureForm({
  defaultValues,
  onSubmit,
  submitLabel = 'Save',
  onCancel,
}: FeatureFormProps) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSubmit = async (data: TCreateFeatureInput) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } catch (error) {
      // Error handling is done by parent component
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pt-5">
      <Form
        schema={createFeatureSchema}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        mode="onChange"
        reValidateMode="onChange">
        <FormLayout title="New Feature">
          <FeatureFormFields />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onCancel ? onCancel() : navigate('/features')
              }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </FormLayout>
      </Form>
    </div>
  )
}
