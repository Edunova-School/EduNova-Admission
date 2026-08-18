import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, User } from "lucide-react"
import { useApplication } from "./ApplicationContext"
import type { PersonalInfo } from "./ApplicationContext"
const ADMISSION_BASE = "/admission/apply/undergraduate"
const lgasByState: Record<string, string[]> = {
  Lagos: [
    "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry",
    "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu",
    "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo",
    "Shomolu", "Surulere",
  ],
  Oyo: [
    "Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East",
    "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central",
    "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa",
    "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo",
    "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East",
    "Saki West", "Surulere",
  ],
  Kano: [
    "Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta",
    "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam",
    "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya",
    "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa",
    "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa",
    "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil",
  ],
  Rivers: [
    "Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru",
    "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana",
    "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro",
    "Oyigbo", "Port Harcourt", "Tai",
  ],
  "Abuja (FCT)": ["Abaji", "Abuja Municipal", "Bwari", "Gwagwalada", "Kuje", "Kwali"],
  Kaduna: [
    "Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia",
    "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau",
    "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria",
  ],
  Enugu: [
    "Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti",
    "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka",
    "Oji River", "Udenu", "Udi", "Uzo-Uwani",
  ],
  Delta: [
    "Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West",
    "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East",
    "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele",
    "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North",
    "Warri South", "Warri South West",
  ],
  Anambra: [
    "Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South",
    "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala",
    "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South",
    "Orumba North", "Orumba South", "Oyi",
  ],
  Ogun: [
    "Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South",
    "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode",
    "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Remo North",
    "Shagamu",
  ],
}
const nigerianStates = Object.keys(lgasByState)
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-xs tracking-wide uppercase text-black/50">{label}</label>
      {children}
    </div>
  )
}
const inputClass = "border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors"
export default function PersonalInformation() {
  const navigate = useNavigate()
  const { data, setPersonal } = useApplication()
  const [form, setForm] = useState<PersonalInfo>(data.personal)
  const availableLgas = form.state ? lgasByState[form.state] ?? [] : []
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, state: e.target.value, lga: "" })
  }
  const canContinue = form.dob && form.gender && form.nationality && form.state && form.lga && form.address && form.phone
  const handleContinue = () => {
    if (!canContinue) return
    setPersonal(form)
    navigate(`${ADMISSION_BASE}/academic-information`)
  }
  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-black/40">Step 3 of 8</span>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-black mt-2">Personal Information</h1>
        <p className="text-sm text-black/55 mt-2">Tell us a bit about yourself. This information should match your official documents.</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-6 flex flex-col gap-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center">
            <User size={16} strokeWidth={1.75} className="text-[#1E3A8A]" />
          </div>
          <p className="font-mono text-xs tracking-widest uppercase text-[#B8901F]">Basic Details</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Date of Birth">
            <input type="date" name="dob" value={form.dob} onChange={handleChange} className={inputClass} />
          </Field>
          <Field label="Gender">
            <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Nationality">
            <input name="nationality" value={form.nationality} onChange={handleChange} placeholder="Nigerian" className={inputClass} />
          </Field>
          <Field label="State of Origin">
            <select name="state" value={form.state} onChange={handleStateChange} className={inputClass}>
              <option value="">Select...</option>
              {nigerianStates.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Local Government Area">
          <select name="lga" value={form.lga} onChange={handleChange} disabled={!form.state} className={`${inputClass} disabled:bg-black/[0.02] disabled:text-black/30 disabled:cursor-not-allowed`}>
            <option value="">{form.state ? "Select..." : "Select a state first"}</option>
            {availableLgas.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </Field>
        <Field label="Residential Address">
          <textarea name="address" value={form.address} onChange={handleChange as any} rows={3} className={`${inputClass} resize-none`}/>
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Phone Number">
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} />
          </Field>
          <Field label="Alternate Phone (optional)">
            <input name="altPhone" type="tel" value={form.altPhone} onChange={handleChange} className={inputClass} />
          </Field>
        </div>
      </div>
      <button onClick={handleContinue} disabled={!canContinue} className="self-end flex items-center gap-2 bg-gradient-to-r from-[#14263F] to-[#1E3A8A] text-white text-sm font-semibold px-7 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-40 disabled:hover:translate-y-0">
        Continue <ArrowRight size={16} />
      </button>
    </div>
  )
}