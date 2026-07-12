import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useCreateReward, useUpdateReward } from '@/api/hooks/useBadgesRewards';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  description: z.string().optional(),
  pointsRequired: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
});

export const RewardModal = ({ open, onClose, reward }) => {
  const createReward = useCreateReward();
  const updateReward = useUpdateReward();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) reset(reward || {});
  }, [open, reward, reset]);

  const onSubmit = async (values) => {
    try {
      if (reward) {
        await updateReward.mutateAsync({ id: reward._id, data: values });
        toast.success('Reward updated');
      } else {
        await createReward.mutateAsync(values);
        toast.success('Reward created');
      }
      onClose();
    } catch (err) {
      // handled globally
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={reward ? 'Edit Reward' : 'New Reward'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Textarea label="Description" {...register('description')} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Points Required" type="number" error={errors.pointsRequired?.message} {...register('pointsRequired')} />
          <Input label="Stock" type="number" error={errors.stock?.message} {...register('stock')} />
        </div>
        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          {reward ? 'Save Changes' : 'Create Reward'}
        </Button>
      </form>
    </Modal>
  );
};
