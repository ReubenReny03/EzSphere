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
import { useCreateProduct, useUpdateProduct } from '@/api/hooks/useProducts';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  sku: z.string().min(1, 'Required'),
  department: z.string().optional(),
  carbonFootprint: z.coerce.number().min(0).optional(),
  recyclablePct: z.coerce.number().min(0).max(100).optional(),
  ethicalSourcingScore: z.coerce.number().min(0).max(100).optional(),
});

export const ProductModal = ({ open, onClose, product }) => {
  const { data: depts } = useDepartments({ limit: 100 });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) reset(product ? { ...product, department: product.department?._id } : {});
  }, [open, product, reset]);

  const onSubmit = async (values) => {
    try {
      if (product) {
        await updateProduct.mutateAsync({ id: product._id, data: values });
        toast.success('Product profile updated');
      } else {
        await createProduct.mutateAsync(values);
        toast.success('Product profile created');
      }
      onClose();
    } catch (err) {
      // handled globally
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={product ? 'Edit Product ESG Profile' : 'New Product ESG Profile'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Input label="SKU" error={errors.sku?.message} {...register('sku')} />
        <Select
          label="Department"
          placeholder="Select department"
          options={(depts?.data || []).map((d) => ({ value: d._id, label: d.name }))}
          {...register('department')}
        />
        <div className="grid grid-cols-3 gap-3">
          <Input label="Carbon Footprint" type="number" step="any" {...register('carbonFootprint')} />
          <Input label="Recyclable %" type="number" {...register('recyclablePct')} />
          <Input label="Ethical Sourcing" type="number" {...register('ethicalSourcingScore')} />
        </div>
        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          {product ? 'Save Changes' : 'Create Profile'}
        </Button>
      </form>
    </Modal>
  );
};
