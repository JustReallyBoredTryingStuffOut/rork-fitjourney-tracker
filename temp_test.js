try {
  const rnh1 = require('react-native-health');
  console.log('require:', Object.keys(rnh1));
  
  const rnh2 = require('react-native-health').default;
  console.log('require default:', Object.keys(rnh2 || {}));
  
  const rnh3 = require('react-native-health').AppleHealthKit;
  console.log('require AppleHealthKit:', Object.keys(rnh3 || {}));
} catch (e) {
  console.log('Error:', e.message);
}
