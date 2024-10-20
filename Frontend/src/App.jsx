import { useEffect, useState } from "react";
// import Forecast from "./components/Forecast";
import Inputs from "./components/Inputs";
import TempAndDetails from "./components/TempAndDetails";
import TimeAndLocation from "./components/TimeAndLocation";
import TopButtons from "./components/TopButtons";
import getFormattedWeatherData from "./services/weatherService";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const App = () => {
  const [query, setQuery] = useState({ q: "ahmedabad" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [threshold,setThreshold]=useState(35);
  const [cityName, setCityName]=useState("");

  const getWeather = async () => {
    const cityName = query.q ? query.q : "current location";
    toast.info(`Fetching weather data for ${capitalizeFirstLetter(cityName)}`);
    setCityName(cityName);

    await getFormattedWeatherData({ ...query, units }).then((data) => {
      toast.success(`Fetched weather data for ${data.name}, ${data.country}`);
      setWeather(data);
    });
    console.log(data);
  };

  useEffect(() => {
    getWeather();
    const intervalId = setInterval(() => {
      getWeather();
    }, 300000);
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return "from-light-green-300 to-light-green-500";
    const threshold2 = units === "metric" ? 20 : 60;
    // const threshold2 = units === "metric"?35:308.15;
    if(weather.temp > threshold){
      toast.warn(`Temperature exceeded threshold! in ${cityName}`);
      return "from-green-300 to-green-500";
    }
    if (weather.temp <= threshold2) return "from-light-blue-300 to-light-blue-500";
    return "from-green-300 to-green-500";
  };

  return (
    <div
      className={`w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-br shadow-xl shadow-gray-400 ${formatBackground()}`}
    >
       {/* Expanding the elements to take full screen width */}
       <div className="flex flex-col w-full px-8 py-4 flex-grow">
      <TopButtons setQuery={setQuery} />
      <Inputs setQuery={setQuery} setUnits={setUnits} setThreshold={setThreshold} />

      {weather && (
        <>
          <TimeAndLocation weather={weather} />
          <TempAndDetails weather={weather} units={units} />
        </>
      )}
      </div>
      <ToastContainer autoClose={2500} hideProgressBar={true} theme="colored" />
    </div>
  );
};

export default App;
