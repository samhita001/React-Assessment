import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Dialog, DialogType, TextField, Dropdown, IDropdownOption, PrimaryButton, DefaultButton, IconButton } from '@fluentui/react';
import { zodResolver } from '@hookform/resolvers/zod';

interface Field {
  fields: string[];
}

interface Row {
  fields: string[];
}

interface Section {
  label: string;
  rows: Row[];
}

interface FormData {
  viewType: string;
  sections: Section[];
}

const viewTypes: IDropdownOption[] = [
  { key: 'create', text: 'Create' },
  { key: 'edit', text: 'Edit' },
  { key: 'view', text: 'View' }
];

const schema = z.object({
  viewType: z.string().min(1, 'View type is required'),
  sections: z.array(z.object({
    label: z.string().min(1, 'Section label is required'),
    rows: z.array(z.object({
      fields: z.array(z.string().min(1, 'Field is required'))
    })).min(1, 'At least one row is required')
  }))
});

export const FormContainer: React.FC = () => {
  const { control, handleSubmit, watch, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { sections: [] }
  });
  const [showDialog, setShowDialog] = useState(false);

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
    reset();
    setShowDialog(false);
  };

  const addSection = () => {
    const sections = watch('sections') as Section[];
    sections.push({ label: '', rows: [{ fields: ['', '', ''] }] });
    reset({ sections });
  };

  return (
    <>
      <PrimaryButton text="Open Form" onClick={() => setShowDialog(true)} />
      <Dialog
        hidden={!showDialog}
        onDismiss={() => setShowDialog(false)}
        dialogContentProps={{ title: 'Metadata Form', type: DialogType.largeHeader }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="viewType"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={viewTypes}
                label="View Type"
                required
              />
            )}
          />
          <div>
            {watch('sections')?.map((section: Section, index: number) => (
              <div key={index}>
                <Controller
                  name={`sections.${index}.label`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label={`Section ${index + 1} Label`} required />
                  )}
                />
                {section.rows.map((row: Row, rowIndex: number) => (
                  <div key={rowIndex}>
                    {row.fields.map((field: string, fieldIndex: number) => (
                      <Controller
                        key={fieldIndex}
                        name={`sections.${index}.rows.${rowIndex}.fields.${fieldIndex}`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label={`Field ${fieldIndex + 1}`} required />
                        )}
                      />
                    ))}
                    <IconButton iconProps={{ iconName: 'Delete' }} title="Delete Row" onClick={() => {/* Logic to delete row */}} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <PrimaryButton text="Add Section" onClick={addSection} />
          <DefaultButton text="Submit" type="submit" />
        </form>
      </Dialog>
    </>
  );
};
