import { Head, Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Building2, Text, DollarSign } from 'lucide-react';
import { useState } from 'react';

export default function CreateCompanyService() {
  const [success, setSuccess] = useState(false);

  return (
    <>
      <Head title="Create Company Service" />

      {success && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          Company service created successfully!
        </div>
      )}

      <Form
        method="post"
        action="/services/company"
        className="flex flex-col gap-6"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Service Name</Label>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="off"
                    placeholder="Enter service name"
                  />
                </div>
                <InputError message={errors.name} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <div className="flex items-center gap-2">
                  <Text className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="description"
                    type="text"
                    name="description"
                    required
                    tabIndex={2}
                    autoComplete="off"
                    placeholder="Enter description"
                  />
                </div>
                <InputError message={errors.description} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    name="price"
                    required
                    tabIndex={3}
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                  />
                </div>
                <InputError message={errors.price} />
              </div>

              <Button
                type="submit"
                className="mt-4 w-full"
                tabIndex={4}
                disabled={processing}
              >
                {processing && <Spinner className="h-4 w-4" />}
                Create Company Service
              </Button>
            </>
          }
        )}
      </Form>
    </>
  );
}