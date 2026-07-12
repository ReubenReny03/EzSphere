import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreateEmissionFactor, useUpdateEmissionFactor } from '@/api/hooks/useEmissionFactors';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  activityType: z.enum(['PURCHASE', 'MANUFACTURING', 'EXPENSE', 'FLEET']),
  unit: z.string().min(1, 'Required'),
  value: z.coerce.number().min(0),
  source: z.string().optional(),
});

export const EmissionFactorModal = ({ open, onClose, factor }) => {
  const createFactor = useCreateEmissionFactor();
  const updateFactor = useUpdateEmissionFactor();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) reset(factor || { activityType: 'PURCHASE' });
  }, [open, factor, reset]);

  const onSubmit = async (values) => {
    try {
      if (factor) {
        await updateFactor.mutateAsync({ id: factor._id, data: values });
        toast.success('Emission factor updated');
      } else {
        await createFactor.mutateAsync(values);
        toast.success('Emission factor created');
      }
      onClose();
    } catch (err) {
      // handled globally
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={factor ? 'Edit Emission Factor' : 'New Emission Factor'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Select
          label="Activity Type"
          error={errors.activityType?.message}
          options={[
            { value: 'PURCHASE', label: 'Purchase' },
            { value: 'MANUFACTURING', label: 'Manufacturing' },
            { value: 'EXPENSE', label: 'Expense' },
            { value: 'FLEET', label: 'Fleet' },
          ]}
          {...register('activityType')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Unit" placeholder="kgCO2/L" error={errors.unit?.message} {...register('unit')} />
          <Input label="Value" type="number" step="any" error={errors.value?.message} {...register('value')} />
        </div>
        <Input label="Source" {...register('source')} />
        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          {factor ? 'Save Changes' : 'Create Factor'}
        </Button>
      </form>
    </Modal>
  );
};
