import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { useNavigate } from 'react-router-dom'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Country {
  name: string
  population: number
  region: string
}

interface PopulationByContinent {
  [key: string]: number
}

const Continents: React.FC = () => {
  const [populations, setPopulations] = useState<PopulationByContinent>({})
  const navigate = useNavigate()

  useEffect(() => {
    axios.get<Country[]>('https://restcountries.com/v2/all')
      .then(response => {
        const data = response.data
        
        const populationByContinent = data.reduce((acc: PopulationByContinent, country: Country) => {
          const continent = country.region
          if (continent) {
            acc[continent] = (acc[continent] || 0) + country.population
          }
          return acc
        }, {})

        setPopulations(populationByContinent)
      })
      .catch(error => console.error('Error fetching countries:', error))
  }, [])

  const data = {
    labels: Object.keys(populations),
    datasets: [
      {
        label: 'Population by Continent',
        data: Object.values(populations).map(population => population / 1_000_000_000),
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
            return `${value} B`;
          }
        },
        title: {
          display: true,
          text: 'Population (billions)',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem: any) {
            return `${tooltipItem.raw.toFixed(1)} B inhabitants`;
          }
        }
      }
    },
    onClick: (event: any) => {
      const chart = event.chart;
      const elements = chart.getElementsAtEventForMode(event.native, 'nearest', { intersect: true }, true);

      if (elements.length) {
        const index = elements[0].index;
        const continent = data.labels[index];
        navigate(`/countries/${continent}`);
      }
    }
  };

  return (
    <div>
      <h1>Population by Continent</h1>
      <Bar 
        data={data} 
        options={options} 
      />
    </div>
  );
};

export default Continents;
