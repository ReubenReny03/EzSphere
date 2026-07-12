import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCreateDepartment, useUpdateDepartment } from '@/api/hooks/useDepartments';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  code: z.string().min(1, 'Required'),
  diversityScore: z.coerce.number().min(0).max(100).optional(),
  emissionBudget: z.coerce.number().min(0).optional(),
});

export const DepartmentModal = ({ open, onClose, department }) => {
  const createDept = useCreateDepartment();
  const updateDept = useUpdateDepartment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) reset(department || {});
  }, [open, department, reset]);

  const onSubmit = async (values) => {
    try {
      if (department) {
        await updateDept.mutateAsync({ id: department._id, data: values });
        toast.success('Department updated');
      } else {
        await createDept.mutateAsync(values);
        toast.success('Department created');
      }
      onClose();
    } catch (err) {
      // handled globally
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={department ? 'Edit Department' : 'New Department'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Input label="Code" error={errors.code?.message} {...register('code')} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Diversity Score (0-100)" type="number" {...register('diversityScore')} />
          <Input label="Emission Budget (kg CO₂e)" type="number" {...register('emissionBudget')} />
        </div>
        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          {department ? 'Save Changes' : 'Create Department'}
        </Button>
      </form>
    </Modal>
  );
};
