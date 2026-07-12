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
import { useDepartments } from '@/api/hooks/useDepartments';
import { useCreateAudit, useUpdateAudit } from '@/api/hooks/useCompliance';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  department: z.string().min(1, 'Required'),
  auditor: z.string().optional(),
  date: z.string().min(1, 'Required'),
  findingsCount: z.coerce.number().min(0).optional(),
  findings: z.string().optional(),
  status: z.enum(['Scheduled', 'In Progress', 'Under Review', 'Completed']).optional(),
});

export const AuditModal = ({ open, onClose, audit }) => {
  const { data: depts } = useDepartments({ limit: 100 });
  const createAudit = useCreateAudit();
  const updateAudit = useUpdateAudit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) {
      reset(
        audit
          ? { ...audit, department: audit.department?._id, date: audit.date?.slice(0, 10) }
          : { status: 'Scheduled' },
      );
    }
  }, [open, audit, reset]);

  const onSubmit = async (values) => {
    try {
      if (audit) {
        await updateAudit.mutateAsync({ id: audit._id, data: values });
        toast.success('Audit updated');
      } else {
        await createAudit.mutateAsync(values);
        toast.success('Audit created');
      }
      onClose();
    } catch (err) {
      // handled globally
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={audit ? 'Edit Audit' : 'New Audit'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Title" error={errors.title?.message} {...register('title')} />
        <Select
          label="Department"
          placeholder="Select department"
          error={errors.department?.message}
          options={(depts?.data || []).map((d) => ({ value: d._id, label: d.name }))}
          {...register('department')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Auditor" {...register('auditor')} />
          <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
        </div>
        <Input label="Findings Count" type="number" {...register('findingsCount')} />
        <Textarea label="Findings" {...register('findings')} />
        {audit && (
          <Select
            label="Status"
            options={[
              { value: 'Scheduled', label: 'Scheduled' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Under Review', label: 'Under Review' },
              { value: 'Completed', label: 'Completed' },
            ]}
            {...register('status')}
          />
        )}
        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          {audit ? 'Save Changes' : 'Create Audit'}
        </Button>
      </form>
    </Modal>
  );
};
