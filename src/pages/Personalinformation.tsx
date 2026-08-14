// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { ArrowRight, User } from "lucide-react"
// import { useApplication, PersonalInfo } from "./ApplicationContext"

// const nigerianStates = [
//   "Lagos", "Oyo", "Kano", "Rivers", "Abuja (FCT)", "Kaduna", "Enugu", "Delta", "Anambra", "Ogun",
// ]

// function Field({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <div className="flex flex-col gap-2">
//       <label className="font-mono text-xs tracking-wide uppercase text-black/50">{label}</label>
//       {children}
//     </div>
//   )
// }

// const inputClass = "border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors"

// export default function PersonalInformation() {
//   const navigate = useNavigate()
//   const { data, setPersonal } = useApplication()
//   const [form, setForm] = useState<PersonalInfo>(data.personal)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const canContinue = form.dob && form.gender && form.nationality && form.state && form.address && form.phone

//   const handleContinue = () => {
//     if (!canContinue) return
//     setPersonal(form)
//     navigate("/admission/academic-information")
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       <div>
//         <span className="font-mono text-xs tracking-[0.2em] uppercase text-black/40">Step 3 of 8</span>
//         <h1 className="font-serif text-2xl md:text-3xl font-semibold text-black mt-2">Personal Information</h1>
//         <p className="text-sm text-black/55 mt-2">Tell us a bit about yourself. This information should match your official documents.</p>
//       </div>

//       <div className="bg-white rounded-2xl border border-black/5 p-6 flex flex-col gap-5">
//         <div className="flex items-center gap-2 mb-1">
//           <div className="w-8 h-8 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center">
//             <User size={16} strokeWidth={1.75} className="text-[#1E3A8A]" />
//           </div>
//           <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F]">Basic Details</p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//           <Field label="Date of Birth">
//             <input type="date" name="dob" value={form.dob} onChange={handleChange} className={inputClass} />
//           </Field>
//           <Field label="Gender">
//             <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
//               <option value="">Select...</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//             </select>
//           </Field>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//           <Field label="Nationality">
//             <input name="nationality" value={form.nationality} onChange={handleChange} placeholder="Nigerian" className={inputClass} />
//           </Field>
//           <Field label="State of Origin">
//             <select name="state" value={form.state} onChange={handleChange} className={inputClass}>
//               <option value="">Select...</option>
//               {nigerianStates.map((s) => <option key={s} value={s}>{s}</option>)}
//             </select>
//           </Field>
//         </div>

//         <Field label="Local Government Area">
//           <input name="lga" value={form.lga} onChange={handleChange} className={inputClass} />
//         </Field>

//         <Field label="Residential Address">
//           <textarea
//             name="address"
//             value={form.address}
//             onChange={handleChange as any}
//             rows={3}
//             className={`${inputClass} resize-none`}
//           />
//         </Field>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//           <Field label="Phone Number">
//             <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} />
//           </Field>
//           <Field label="Alternate Phone (optional)">
//             <input name="altPhone" type="tel" value={form.altPhone} onChange={handleChange} className={inputClass} />
//           </Field>
//         </div>
//       </div>

//       <button
//         onClick={handleContinue}
//         disabled={!canContinue}
//         className="self-end flex items-center gap-2 bg-gradient-to-r from-[#14263F] to-[#1E3A8A] text-white text-sm font-semibold px-7 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-40 disabled:hover:translate-y-0"
//       >
//         Continue <ArrowRight size={16} />
//       </button>
//     </div>
//   )
// }