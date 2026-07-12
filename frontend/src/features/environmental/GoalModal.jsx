import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useDepartments } from '@/api/hooks/useDepartments';
import { useCreateGoal, useUpdateGoal } from '@/api/hooks/useGoals';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  department: z.string().min(1, 'Required'),
  metric: z.enum(['CO2_REDUCTION', 'ENERGY', 'WASTE']),
  targetValue: z.coerce.number().min(0),
  currentValue: z.coerce.number().min(0).optional(),
  unit: z.string().optional(),
  deadline: z.string().min(1, 'Required'),
  status: z.enum(['Active', 'On Track', 'At Risk', 'Completed']).optional(),
});

export const GoalModal = ({ open, onClose, goal }) => {
  const { data: depts } = useDepartments({ limit: 100 });
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) {
      reset(
        goal
          ? { ...goal, department: goal.department?._id, deadline: goal.deadline?.slice(0, 10) }
          : { metric: 'CO2_REDUCTION', status: 'Active' },
      );
    }
  }, [open, goal, reset]);

  const onSubmit = async (values) => {
    try {
      if (goal) {
        await updateGoal.mutateAsync({ id: goal._id, data: values });
        toast.success('Goal updated');
      } else {
        await createGoal.mutateAsync(values);
        toast.success('Goal created');
      }
      onClose();
    } catch (err) {
      // handled by axios interceptor
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={goal ? 'Edit Goal' : 'New Environmental Goal'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Select
          label="Department"
          placeholder="Select department"
          error={errors.department?.message}
          options={(depts?.data || []).map((d) => ({ value: d._id, label: d.name }))}
          {...register('department')}
        />
        <Select
          label="Metric"
          error={errors.metric?.message}
          options={[
            { value: 'CO2_REDUCTION', label: 'CO2 Reduction' },
            { value: 'ENERGY', label: 'Energy' },
            { value: 'WASTE', label: 'Waste' },
          ]}
          {...register('metric')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Target Value" type="number" step="any" error={errors.targetValue?.message} {...register('targetValue')} />
          <Input label="Current Value" type="number" step="any" error={errors.currentValue?.message} {...register('currentValue')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Unit" {...register('unit')} />
          <Input label="Deadline" type="date" error={errors.deadline?.message} {...register('deadline')} />
        </div>
        {goal && (
          <Select
            label="Status"
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'On Track', label: 'On Track' },
              { value: 'At Risk', label: 'At Risk' },
              { value: 'Completed', label: 'Completed' },
            ]}
            {...register('status')}
          />
        )}
        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          {goal ? 'Save Changes' : 'Create Goal'}
        </Button>
      </form>
    </Modal>
  );
};
