import { useState } from "react";
import { Search, Hospital, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";

// Delhi NCR hospitals data grouped by area
const hospitalsData: Record<string, { name: string; address: string; phone: string }[]> = {
  "Anand Vihar": [
    { name: "Max Super Speciality Hospital", address: "108A, IP Extension, Patparganj", phone: "011-4055 4055" },
    { name: "Dharamshila Narayana Hospital", address: "Dharamshila Marg, Vasundhara Enclave", phone: "011-4712 2222" },
  ],
  "Dwarka": [
    { name: "Venkateshwar Hospital", address: "Sec 18A, Dwarka", phone: "011-4220 2222" },
    { name: "Manipal Hospital Dwarka", address: "Sec 6, Dwarka", phone: "011-4966 6666" },
  ],
  "Rohini": [
    { name: "Jaipur Golden Hospital", address: "Sec 3, Rohini", phone: "011-2757 2100" },
    { name: "Saroj Super Speciality Hospital", address: "Sec 14, Rohini", phone: "011-4700 4700" },
  ],
  "Punjabi Bagh": [
    { name: "Handa Nursing Home", address: "Club Rd, Punjabi Bagh", phone: "011-2521 0101" },
    { name: "Balaji Action Medical Institute", address: "A-4, Paschim Vihar", phone: "011-4299 4299" },
  ],
  "Noida": [
    { name: "Fortis Hospital Noida", address: "B-22, Sec 62, Noida", phone: "0120-240 0222" },
    { name: "Jaypee Hospital", address: "Sec 128, Noida", phone: "0120-412 2222" },
    { name: "Yatharth Hospital", address: "Sec 110, Noida", phone: "0120-461 2222" },
  ],
  "Greater Noida": [
    { name: "Sharda Hospital", address: "Knowledge Park III", phone: "0120-231 0099" },
    { name: "Kailash Hospital", address: "Sec Alpha 2", phone: "0120-232 5000" },
  ],
  "Gurugram": [
    { name: "Medanta – The Medicity", address: "Sec 38, Gurugram", phone: "0124-414 1414" },
    { name: "Artemis Hospital", address: "Sec 51, Gurugram", phone: "0124-676 7000" },
    { name: "Fortis Memorial Research Institute", address: "Sec 44, Gurugram", phone: "0124-496 2200" },
  ],
  "Faridabad": [
    { name: "Asian Hospital", address: "Sec 21A, Faridabad", phone: "0129-410 3333" },
    { name: "Sarvodaya Hospital", address: "YMCA Rd, Sec 8, Faridabad", phone: "0129-427 0000" },
  ],
  "Ghaziabad": [
    { name: "Yashoda Super Speciality Hospital", address: "Nehru Nagar, Ghaziabad", phone: "0120-412 2000" },
    { name: "Columbia Asia Hospital", address: "NH-24, Ghaziabad", phone: "0120-673 6200" },
  ],
  "ITO": [
    { name: "LNJP Hospital", address: "JLN Marg, Delhi Gate", phone: "011-2323 4242" },
    { name: "Maulana Azad Medical College", address: "BSZ Marg, Delhi Gate", phone: "011-2323 9271" },
  ],
  "Shadipur": [
    { name: "Sir Ganga Ram Hospital", address: "Rajinder Nagar", phone: "011-2586 1313" },
    { name: "BLK-Max Super Speciality Hospital", address: "Pusa Rd", phone: "011-3040 3040" },
  ],
  "RK Puram": [
    { name: "AIIMS", address: "Ansari Nagar, New Delhi", phone: "011-2658 8500" },
    { name: "Safdarjung Hospital", address: "Ansari Nagar West", phone: "011-2616 4033" },
  ],
  "Siri Fort": [
    { name: "Holy Family Hospital", address: "Okhla Rd, Jasola", phone: "011-2668 4440" },
    { name: "Apollo Hospital", address: "Sarita Vihar, Mathura Rd", phone: "011-7179 1090" },
  ],
  "Okhla": [
    { name: "Holy Family Hospital", address: "Okhla Rd, Jasola", phone: "011-2668 4440" },
    { name: "Apollo Hospital", address: "Sarita Vihar", phone: "011-7179 1090" },
  ],
  "Jahangirpuri": [
    { name: "BJRM Hospital", address: "Jahangirpuri", phone: "011-2727 2071" },
    { name: "Deep Chand Bandhu Hospital", address: "Ashok Vihar", phone: "011-2713 6565" },
  ],
  "Wazirpur": [
    { name: "Max Hospital Shalimar Bagh", address: "Shalimar Bagh", phone: "011-2735 8700" },
    { name: "Fortis Hospital Shalimar Bagh", address: "Shalimar Bagh", phone: "011-4530 2222" },
  ],
  "Bawana": [
    { name: "SGM Hospital", address: "Mangolpuri", phone: "011-2790 2403" },
    { name: "Sanjay Gandhi Hospital", address: "Mangolpuri", phone: "011-2791 0370" },
  ],
  "Mandir Marg": [
    { name: "RML Hospital", address: "Baba Kharak Singh Marg", phone: "011-2336 5525" },
    { name: "Lady Hardinge Medical College", address: "Connaught Place", phone: "011-2336 3448" },
  ],
};

const allAreas = Object.keys(hospitalsData).sort();

const HospitalSearch = () => {
  const [query, setQuery] = useState("");

  const filtered = query.trim().length > 0
    ? allAreas.filter((a) => a.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="mt-20 rounded-2xl border border-border bg-card p-8 border-glow">
      <div className="flex items-center gap-3 mb-2">
        <Hospital className="h-5 w-5 text-primary" />
        <span className="text-xs font-mono uppercase tracking-widest text-primary">Health Resources</span>
      </div>
      <h3 className="text-2xl font-bold mb-1">Nearby Hospitals</h3>
      <p className="text-muted-foreground text-sm mb-8 max-w-2xl">
        Search your area in Delhi NCR to find nearby hospitals for respiratory and pollution-related health concerns.
      </p>

      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search area (e.g. Dwarka, Noida, Gurugram...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-background border-border font-mono"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-6">
          {filtered.map((area) => (
            <div key={area}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-primary" />
                <h4 className="font-semibold">{area}</h4>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {hospitalsData[area].map((h) => (
                  <div key={h.name} className="rounded-xl border border-border bg-background p-4">
                    <p className="font-medium text-sm mb-1">{h.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">{h.address}</p>
                    <div className="flex items-center gap-1.5 text-xs text-primary">
                      <Phone className="h-3 w-3" />
                      <span className="font-mono">{h.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : query.trim().length > 0 ? (
        <p className="text-muted-foreground text-sm font-mono">No hospitals found for "{query}". Try another Delhi NCR area.</p>
      ) : null}
    </div>
  );
};

export default HospitalSearch;
