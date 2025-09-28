'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { Users, Calendar, X } from 'lucide-react'
import { CreateTaskProps, NewTaskForm } from '@/types'

// import { mockUsers } from '@/utils/mockUsers' // your mock users array

// Validation schema
const taskValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(1, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  assignedTo: Yup.string()
    .email('Please enter a valid email address'),
  priority: Yup.string()
    .required('Priority is required')
    .oneOf(['low', 'medium', 'high', 'urgent'], 'Invalid priority level'),
//   dueDate: Yup.string()
//     .required('Due date is required')
//     .test('is-future-date', 'Due date must be in the future', function(value) {
//       if (!value) return false
//       return moment(value).isAfter(moment())
//     })
})

export default function CreateTask({ open, setOpen, onSubmit, users = [], usersLoading = false, creatingTask = false }: CreateTaskProps) {
  console.log("🚀 ~ CreateTask ~ users:", users)
  const initialValues: NewTaskForm = {
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    // dueDate: moment().add(1, 'week').format('YYYY-MM-DDTHH:mm'),
  }

  const handleFormSubmit = (values: NewTaskForm, { resetForm }: any) => {
    onSubmit(values)
    resetForm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-gray-50 shadow-2xl">
          <div className="flex justify-between items-center bg-black text-white px-8 py-6">
            <div>
              <DialogTitle className="text-3xl font-bold">Create New Task</DialogTitle>
              <p className="text-gray-300">Add a task and assign it to your team</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl">
              <X className="w-6 h-6" />
            </button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={taskValidationSchema}
            onSubmit={handleFormSubmit}
            enableReinitialize
          >
            {({ errors, touched, isValid, dirty }) => (
              <Form className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                {/* Title */}
                <div>
                  <label className="text-slate-900 block text-sm font-bold uppercase">Task Title *</label>
                  <Field
                    name="title"
                    type="text"
                    placeholder="Enter task title..."
                    className={`text-slate-900 placeholder-slate-400 w-full px-6 py-3 rounded-2xl border-2 focus:ring-2 focus:ring-black text-sm ${
                      errors.title && touched.title ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
                    }`}
                  />
                  <ErrorMessage name="title" component="p" className="text-red-600 text-sm mt-1" />
                </div>

                {/* Description */}
                <div>
                  <label className="text-slate-900 block text-sm font-bold uppercase">Description *</label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={4}
                    placeholder="Describe the task..."
                    className={`text-slate-900 placeholder-slate-400 w-full px-6 py-3 rounded-2xl border-2 focus:ring-2 focus:ring-black text-sm resize-none ${
                      errors.description && touched.description ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
                    }`}
                  />
                  <ErrorMessage name="description" component="p" className="text-red-600 text-sm mt-1" />
                </div>

                <div className="text-slate-900 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Assign To */}
                  <div>
                    <label className="block text-sm font-bold uppercase">Assign To</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Field
                        as="select"
                        name="assignedTo"
                        disabled={usersLoading}
                        className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 focus:ring-2 focus:ring-black text-sm ${
                          errors.assignedTo && touched.assignedTo ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
                        } ${usersLoading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                      >
                        {usersLoading ? (
                          <option value="" disabled>Loading users...</option>
                        ) : (
                          <option value="">Select team member...</option>
                        )}
                        {!usersLoading && users.map((u) => (
                          <option key={u.email} value={u.email}>
                            {u.fullName} ({u.email})
                          </option>
                        ))}
                      </Field>
                    </div>
                    <ErrorMessage name="assignedTo" component="p" className="text-red-600 text-sm mt-1" />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-bold uppercase">Priority</label>
                    <Field
                      as="select"
                      name="priority"
                      className={`w-full px-6 py-3 rounded-2xl border-2 focus:ring-2 focus:ring-black text-sm ${
                        errors.priority && touched.priority ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </Field>
                    <ErrorMessage name="priority" component="p" className="text-red-600 text-sm mt-1" />
                  </div>
                </div>

                {/* Due Date */}
                {/* <div>
                  <label className="text-slate-900 block text-sm font-bold uppercase">Due Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Field
                      name="dueDate"
                      type="datetime-local"
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 focus:ring-2 focus:ring-black text-lg ${
                        errors.dueDate && touched.dueDate ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
                      }`}
                    />
                  </div>
                  <ErrorMessage name="dueDate" component="p" className="text-red-600 text-sm mt-1" />
                </div> */}

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 py-3 px-6 bg-gray-200 rounded-2xl text-black font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid || !dirty || creatingTask}
                    className="flex-1 py-3 px-6 bg-black text-white rounded-2xl font-bold hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {creatingTask && (
                      <span className="w-4 h-4 border-2 border-white border-t-blue-600 rounded-full animate-spin inline-block"></span>
                    )}
                    {creatingTask ? 'Creating...' : 'Create Task'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogPanel>
      </div>
    </Dialog>
  )
}