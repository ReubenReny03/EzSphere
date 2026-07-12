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
import { useCreateComplianceIssue, useUpdateComplianceIssue } from '@/api/hooks/useCompliance';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  description: z.string().optional(),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
  owner: z.string().min(1, 'Owner is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  department: z.string().optional(),
  status: z.enum(['Open', 'Under Review', 'Resolved']).optional(),
});

export const ComplianceIssueModal = ({ open, onClose, issue, users = [] }) => {
  const { data: depts } = useDepartments({ limit: 100 });
  const createIssue = useCreateComplianceIssue();
  const updateIssue = useUpdateComplianceIssue();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) {
      reset(
        issue
          ? {
              ...issue,
              owner: issue.owner?._id,
              department: issue.department?._id,
              dueDate: issue.dueDate?.slice(0, 10),
            }
          : { severity: 'Medium' },
      );
    }
  }, [open, issue, reset]);

  const onSubmit = async (values) => {
    try {
      if (issue) {
        await updateIssue.mutateAsync({ id: issue._id, data: values });
        toast.success('Compliance issue updated');
      } else {
        await createIssue.mutateAsync(values);
        toast.success('Compliance issue created — owner notified');
      }
      onClose();
    } catch (err) {
      // handled globally
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={issue ? 'Edit Compliance Issue' : 'Raise Compliance Issue'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Title" error={errors.title?.message} {...register('title')} />
        <Textarea label="Description" {...register('description')} />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Severity"
            error={errors.severity?.message}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
              { value: 'Critical', label: 'Critical' },
            ]}
            {...register('severity')}
          />
          <Input label="Due Date" type="date" error={errors.dueDate?.message} {...register('dueDate')} />
        </div>
        <Select
          label="Owner"
          placeholder="Select owner"
          error={errors.owner?.message}
          options={users.map((u) => ({ value: u._id, label: u.name }))}
          {...register('owner')}
        />
        <Select
          label="Department"
          placeholder="Select department"
          options={(depts?.data || []).map((d) => ({ value: d._id, label: d.name }))}
          {...register('department')}
        />
        {issue && (
          <Select
            label="Status"
            options={[
              { value: 'Open', label: 'Open' },
              { value: 'Under Review', label: 'Under Review' },
              { value: 'Resolved', label: 'Resolved' },
            ]}
            {...register('status')}
          />
        )}
        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          {issue ? 'Save Changes' : 'Raise Issue'}
        </Button>
      </form>
    </Modal>
  );
};
