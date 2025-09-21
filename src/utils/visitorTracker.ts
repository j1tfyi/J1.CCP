// Visitor tracking using CounterAPI V2
// This tracks homepage visits to your J1.CCP counter workspace

// Your CounterAPI V2 configuration
const COUNTER_CONFIG = {
  workspace: 'j1ccp',  // Your workspace slug from counterapi.dev
  counterName: 'j1ccp',  // Your counter slug (as configured in counterapi.dev)
  // Using authentication to create/access private counter
  accessToken: 'ut_ryi4WjbAZ7XgPBSwWpLaMmImyObecnTLAI1YPC4U'
};

export const trackVisitor = async () => {
  try {
    // Track in localStorage for local debugging
    const storageKey = 'j1ccp_visit_tracking';
    const visits = localStorage.getItem(storageKey);
    const visitData = visits ? JSON.parse(visits) : { count: 0, lastVisit: null, history: [] };

    visitData.count += 1;
    visitData.lastVisit = new Date().toISOString();

    // Keep last 100 visits in history
    visitData.history.push({
      timestamp: new Date().toISOString(),
      referrer: document.referrer || 'direct',
      path: window.location.pathname
    });

    if (visitData.history.length > 100) {
      visitData.history = visitData.history.slice(-100);
    }

    localStorage.setItem(storageKey, JSON.stringify(visitData));

    // Track with CounterAPI V2
    // Using authenticated endpoint for private counter
    const response = await fetch(
      `https://api.counterapi.dev/v2/${COUNTER_CONFIG.workspace}/${COUNTER_CONFIG.counterName}/up`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${COUNTER_CONFIG.accessToken}`
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(`Visit recorded - Total visits: ${data.value}`);
    } else {
      console.debug('CounterAPI tracking failed:', response.status);
    }

  } catch (error) {
    // Silently fail - don't disrupt user experience
    console.debug('Visitor tracking failed:', error);
  }
};

// Function to get current visit count from CounterAPI
export const getVisitCount = async () => {
  try {
    const response = await fetch(
      `https://api.counterapi.dev/v2/${COUNTER_CONFIG.workspace}/${COUNTER_CONFIG.counterName}`,
      {
        method: 'GET',
        // Add auth header if using private counter
        // headers: {
        //   'Authorization': `Bearer ${COUNTER_CONFIG.accessToken}`
        // }
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.value;
    } else {
      console.error('Failed to get visit count:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Failed to get visit count:', error);
    return null;
  }
};

// Function to get detailed statistics from CounterAPI
export const getVisitStats = async () => {
  try {
    const response = await fetch(
      `https://api.counterapi.dev/v2/${COUNTER_CONFIG.workspace}/${COUNTER_CONFIG.counterName}/stats`,
      {
        method: 'GET',
        // Add auth header if using private counter
        // headers: {
        //   'Authorization': `Bearer ${COUNTER_CONFIG.accessToken}`
        // }
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Failed to get visit stats:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Failed to get visit stats:', error);
    return null;
  }
};

// Function to get visit data from localStorage (for debugging)
export const getLocalVisitData = () => {
  try {
    const storageKey = 'j1ccp_visit_tracking';
    const visits = localStorage.getItem(storageKey);
    return visits ? JSON.parse(visits) : null;
  } catch (error) {
    console.error('Failed to get local visit data:', error);
    return null;
  }
};