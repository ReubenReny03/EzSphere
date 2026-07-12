import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useDepartments } from '@/api/hooks/useDepartments';
import { useEmissionFactors } from '@/api/hooks/useEmissionFactors';
import { useGenerateCarbonTransaction } from '@/api/hooks/useCarbon';

const schema = z.object({
  department: z.string().min(1, 'Required'),
  sourceType: z.enum(['PURCHASE', 'MANUFACTURING', 'EXPENSE', 'FLEET']),
  emissionFactor: z.string().min(1, 'Required'),
  activityData: z.coerce.number().min(0, 'Must be positive'),
  sourceRef: z.string().optional(),
});

export const LogCarbonModal = ({ open, onClose }) => {
  const { data: depts } = useDepartments({ limit: 100 });
  const { data: factors } = useEmissionFactors({ limit: 100 });
  const generate = useGenerateCarbonTransaction();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await generate.mutateAsync(values);
      toast.success('Carbon transaction generated');
      reset();
      onClose();
    } catch (err) {
      // error toast already shown by axios interceptor
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Log Carbon Activity">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Select
          label="Department"
          placeholder="Select department"
          error={errors.department?.message}
          options={(depts?.data || []).map((d) => ({ value: d._id, label: d.name }))}
          {...register('department')}
        />
        <Select
          label="Source Type"
          placeholder="Select source type"
          error={errors.sourceType?.message}
          options={[
            { value: 'PURCHASE', label: 'Purchase' },
            { value: 'MANUFACTURING', label: 'Manufacturing' },
            { value: 'EXPENSE', label: 'Expense' },
            { value: 'FLEET', label: 'Fleet' },
          ]}
          {...register('sourceType')}
        />
        <Select
          label="Emission Factor"
          placeholder="Select emission factor"
          error={errors.emissionFactor?.message}
          options={(factors?.data || []).map((f) => ({ value: f._id, label: `${f.name} (${f.unit})` }))}
          {...register('emissionFactor')}
        />
        <Input label="Quantity" type="number" step="any" error={errors.activityData?.message} {...register('activityData')} />
        <Input label="Source Reference (optional)" {...register('sourceRef')} />
        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          Generate Transaction
        </Button>
      </form>
    </Modal>
  );
};
