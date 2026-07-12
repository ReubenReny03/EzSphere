import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreateCategory, useUpdateCategory } from '@/api/hooks/useCategories';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  type: z.enum(['CSR_ACTIVITY', 'CHALLENGE']),
});

export const CategoryModal = ({ open, onClose, category }) => {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) reset(category || { type: 'CSR_ACTIVITY' });
  }, [open, category, reset]);

  const onSubmit = async (values) => {
    try {
      if (category) {
        await updateCategory.mutateAsync({ id: category._id, data: values });
        toast.success('Category updated');
      } else {
        await createCategory.mutateAsync(values);
        toast.success('Category created');
      }
      onClose();
    } catch (err) {
      // handled globally
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={category ? 'Edit Category' : 'New Category'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Select
          label="Type"
          error={errors.type?.message}
          options={[
            { value: 'CSR_ACTIVITY', label: 'CSR Activity' },
            { value: 'CHALLENGE', label: 'Challenge' },
          ]}
          {...register('type')}
        />
        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          {category ? 'Save Changes' : 'Create Category'}
        </Button>
      </form>
    </Modal>
  );
};
