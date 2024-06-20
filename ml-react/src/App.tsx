import { useState } from 'react';
import './App.css';

interface Temperature {
  maxTemp: number;
}

function App() {
  const [date, setDate] = useState<string>('');
  const [minTemp, setMinTemp] = useState<string>('');
  const [temperature, setTemperature] = useState<Temperature | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleMinTempChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinTemp(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const minTempFLoat = parseFloat(minTemp);

      if (isNaN(minTempFLoat)) {
        throw new Error('Invalid temperature input');
      }
      if (!date) {
        throw new Error('Invalid data input');
      }

      const [year, month, day] = date.split('-');
      const csvData = `${minTempFLoat},${year},${month},${day}`;
      const response = await fetch(
        'http://localhost:3001/predict-temperature',
        {
          method: 'POST',
          body: csvData,
          headers: {
            'Content-Type': 'text/csv',
          },
        },
      );
      if (!response.ok) {
        throw new Error(`Http error! status: ${response.status}`);
      }

      const responseBody = await response.json();
      setTemperature({ maxTemp: responseBody.maxTemp });
    } catch (error) {
      console.error('Error while fetching temperature:', error);
      setTemperature(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <form onSubmit={handleSubmit} className="weather-form">
        <input
          type="text"
          value={date}
          onChange={handleDateChange}
          placeholder="Enter date (e.g, 2027-01-25)"
          className="weather-input"
        />
        <input
          type="number"
          value={minTemp}
          onChange={handleMinTempChange}
          placeholder="Enter minimum temperature (F)"
          className="weather-input"
        />
        <button type="submit" className="weather-submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Temperature'}
        </button>
      </form>
      {temperature && (
        <div className="weather-response-card">
          <p>Max Temperature: {temperature.maxTemp}F</p>
        </div>
      )}
    </div>
  );
}

export default App;
