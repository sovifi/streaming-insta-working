class InstagramService {
  async fetchAnalytics(accessToken, timeRange = '30') {
    const metrics = ['impressions', 'reach', 'profile_views'];
    
    const response = await axios.get(
      `https://graph.instagram.com/me/insights?metric=${metrics.join(',')}&period=day&access_token=${accessToken}`
    );
    
    return this.formatAnalyticsData(response.data);
  }

  formatAnalyticsData(data) {
    // Transform data for your graphs
    return data.data.map(metric => ({
      name: metric.name,
      values: metric.values.map(value => ({
        date: value.end_time,
        value: value.value
      }))
    }));
  }
} 