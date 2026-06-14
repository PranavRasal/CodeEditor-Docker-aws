import { useState } from "react"
import { languages } from "../constand"

const LanguageSelector = ({ language, onSelect }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")

  

  return (
    <div className="p-4 bg-neutral-700 border-b border-neutral-600">
      <form className="flex items-center gap-4">
        <label htmlFor="language" className="text-sm font-semibold text-white whitespace-nowrap">
          Language:
        </label>
        <select 
          name="language" 
          id="language" 
          value={language}
          onChange={(event) => onSelect(event.target.value)}
          className="px-3 py-2 bg-neutral-800 text-white rounded-md border border-neutral-600 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
        >
          {Object.keys(languages).map((language) => (
            <option key={language} value={language}>
              {language.charAt(0).toUpperCase() + language.slice(1)}
            </option>
          ))}
        </select>
      </form>
    </div>
  )
}

export default LanguageSelector
