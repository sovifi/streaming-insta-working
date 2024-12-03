import { Line } from 'react-chartjs-2';

function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const response = await fetch('/api/instagram/analytics');
    const data = await response.json();
    setAnalyticsData(data);
  };

  return (
    <div className="dashboard">
      {analyticsData && (
        <Line
          data={{
            labels: analyticsData.dates,
            datasets: [
              {
                label: 'Impressions',
                data: analyticsData.impressions,
                borderColor: '#4c51bf'
              },
              // Add more metrics as needed
            ]
          }}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      )}
    </div>
  );
} 