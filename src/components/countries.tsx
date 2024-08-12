import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { useParams, useNavigate } from 'react-router-dom'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Country {
  name: string
  population: number
  region: string
}

const Countries: React.FC = () => {
  const { continent } = useParams<{ continent: string }>()
  const [countries, setCountries] = useState<Country[]>([])
  const navigate = useNavigate()
  
  useEffect(() => {
    axios.get<Country[]>('https://restcountries.com/v2/all')
      .then(response => {
        const data = response.data
        const filteredCountries = data.filter(country => country.region === continent)
        setCountries(filteredCountries)
      })
      .catch(error => console.error('Error fetching countries:', error))
  }, [continent])

  const data = {
    labels: countries.map(country => country.name),
    datasets: [
      {
        label: `Population in ${continent}`,
        data: countries.map(country => country.population / 1_000_000), 
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number | string) {
            return `${value} M`
          }
        },
        title: {
          display: true,
          text: 'Population (millions)',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem: any) {
            return `${tooltipItem.raw.toFixed(1)} M inhabitants`
          }
        }
      }
    }
  };

  return (
    <div>
      <h1>Population by Country in {continent}</h1>
      <button onClick={() => navigate('/')}>Back to Continents</button>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Countries
