import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useCreateBadge, useUpdateBadge } from '@/api/hooks/useBadgesRewards';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  description: z.string().optional(),
  icon: z.string().optional(),
  metric: z.enum(['xp', 'challengesCompleted', 'csrCount']),
  threshold: z.coerce.number().min(0),
});

export const BadgeModal = ({ open, onClose, badge }) => {
  const createBadge = useCreateBadge();
  const updateBadge = useUpdateBadge();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) {
      reset(
        badge
          ? { ...badge, metric: badge.unlockRule.metric, threshold: badge.unlockRule.threshold }
          : { metric: 'xp' },
      );
    }
  }, [open, badge, reset]);

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      description: values.description,
      icon: values.icon,
      unlockRule: { metric: values.metric, threshold: values.threshold },
    };
    try {
      if (badge) {
        await updateBadge.mutateAsync({ id: badge._id, data: payload });
        toast.success('Badge updated');
      } else {
        await createBadge.mutateAsync(payload);
        toast.success('Badge created');
      }
      onClose();
    } catch (err) {
      // handled globally
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={badge ? 'Edit Badge' : 'New Badge'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Textarea label="Description" {...register('description')} />
        <Input label="Icon (emoji)" placeholder="🏅" {...register('icon')} />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Unlock Metric"
            error={errors.metric?.message}
            options={[
              { value: 'xp', label: 'XP' },
              { value: 'challengesCompleted', label: 'Challenges Completed' },
              { value: 'csrCount', label: 'CSR Count' },
            ]}
            {...register('metric')}
          />
          <Input label="Threshold" type="number" error={errors.threshold?.message} {...register('threshold')} />
        </div>
        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          {badge ? 'Save Changes' : 'Create Badge'}
        </Button>
      </form>
    </Modal>
  );
};
