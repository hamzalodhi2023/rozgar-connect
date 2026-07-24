import mongoose from 'mongoose';
import { env } from './config/env.js';
import { Location } from './models/Location.js';

const PAKISTAN_CITIES = [
  'Abbottabad', 'Attock', 'Bahawalpur', 'Bannu', 'Bhakkar', 'Chakwal', 'Charsadda', 'Chiniot', 
  'Dera Ghazi Khan', 'Dera Ismail Khan', 'Faisalabad', 'Gilgit', 'Gujranwala', 'Gujrat', 'Gwadar', 
  'Hafizabad', 'Hyderabad', 'Islamabad', 'Jacobabad', 'Jhang', 'Jhelum', 'Karachi', 'Kasur', 
  'Khuzdar', 'Kohat', 'Lahore', 'Larkana', 'Mardan', 'Mianwali', 'Mirpur', 'Mirpur Khas', 
  'Multan', 'Murree', 'Muzaffarabad', 'Muzaffargarh', 'Nankana Sahib', 'Narowal', 'Nawabshah', 
  'Nowshera', 'Okara', 'Pakpattan', 'Peshawar', 'Quetta', 'Rahim Yar Khan', 'Rawalpindi', 
  'Sahiwal', 'Sargodha', 'Sheikhupura', 'Shikarpur', 'Sialkot', 'Skardu', 'Sukkur', 'Swat', 
  'Turbat', 'Vehari', 'Wazirabad'
];

const PAKISTAN_AREAS = [
  'Blue Area', 'F-5', 'F-6', 'F-7', 'F-8', 'F-10', 'F-11', 'G-6', 'G-7', 'G-8', 'G-9', 'G-10', 'G-11', 'G-13', 'G-14', 'G-15', 'E-7', 'E-11', 'I-8', 'I-9', 'I-10', 'I-11', 'H-8', 'H-9', 'Bani Gala', 'Bahria Town Islamabad', 'DHA Islamabad', 'PWD Housing Society', 'Soan Gardens', 'Ghauri Town', 'Chak Shahzad', 'B-17', 'D-12', 'Diplomatic Enclave',
  'DHA Lahore', 'Gulberg', 'Model Town', 'Johar Town', 'Lahore Cantt', 'Iqbal Town', 'Wapda Town', 'Faisal Town', 'Samanabad', 'Garden Town', 'Cavalry Ground', 'Bahria Town Lahore', 'Askari', 'Township', 'Green Town', 'Mughalpura', 'Baghbanpura', 'Shahdara', 'Thokar Niaz Baig', 'Walled City (Androon Lahore)', 'Shadman', 'Muslim Town', 'Valencia', 'Sabzazar', 'EME Society', 'Lake City',
  'Clifton', 'DHA Karachi', 'Gulshan-e-Iqbal', 'Gulistan-e-Johar', 'North Nazimabad', 'Tariq Road', 'Saddar', 'Malir', 'Korangi', 'PECHS', 'Bahadurabad', 'Scheme 33', 'FB Area', 'Lyari', 'Orangi Town', 'Landhi', 'Shah Faisal Colony', 'Nazimabad', 'Liaquatabad', 'Keamari', 'SITE Area', 'Baldia Town', 'Defence View', 'Bath Island', 'Boat Basin', 'Zamzama',
  'Bahria Town Rawalpindi', 'Rawalpindi Cantt', 'Satellite Town Rawalpindi', 'Commercial Market', 'Westridge', 'Peshawar Road', 'Chaklala Scheme', 'Tench Bhatta', 'Adiala Road', 'Murree Road', 'Faizabad', 'Shamsabad', 'Raja Bazaar', 'Sadiqabad', 'Airport Housing Society', 'Gulraiz', 'Asghar Mall',
  'D Ground', "People's Colony", 'Madina Town', 'Ghulam Muhammad Abad', 'Kohinoor City', 'Samanabad Faisalabad', 'Gulberg Faisalabad', 'Mansoorabad', 'Millat Town', 'Jinnah Colony', 'Amin Town', 'Batala Colony',
  'Gulgasht Colony', 'Bosan Road', 'Shah Rukn-e-Alam', 'Mumtazabad', 'DHA Multan', 'Multan Cantt', 'Wapda Town Multan', 'Bahauddin Zakariya', 'Shershah Road', 'Nawan Shehr', 'Tariqabad',
  'Hayatabad', 'University Town', 'Warsak Road', 'DHA Peshawar', 'Peshawar Cantt', 'Saddar Peshawar', 'Kohat Road', 'Charsadda Road', 'Ring Road', 'Gulbahar', 'Dalazak Road', 'Board Bazar',
  'Jinnah Road', 'Zarghoon Road', 'Sariab Road', 'Quetta Cantt', 'Satellite Town Quetta', 'Alamdar Road', 'Liaquat Bazar', 'Hazar Ganji', 'Brewery Road', 'Nawa Killi',
  'Satellite Town Gujranwala', 'Model Town Gujranwala', 'Wapda Town Gujranwala', 'DC Colony', 'Civil Lines Gujranwala', 'Kamoke',
  'Sialkot Cantt', 'Model Town Sialkot', 'Defence Road', 'Hajipura', 'Ugoki', 'Paris Road', 'Kashmir Road',
  'Latifabad', 'Qasimabad', 'Saddar Hyderabad', 'Hyderabad Cantt', 'Hirabad', 'GOR Colony', 'Defense Hyderabad'
];

const seedLocations = async () => {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log('Connected to DB for seeding locations...');

    let cityCount = 0;
    for (const city of PAKISTAN_CITIES) {
      const name = city.toLowerCase();
      const existing = await Location.findOne({ type: 'city', name });
      if (!existing) {
        await Location.create({ type: 'city', name, label: city });
        cityCount++;
      }
    }

    let areaCount = 0;
    for (const area of PAKISTAN_AREAS) {
      const name = area.toLowerCase();
      const existing = await Location.findOne({ type: 'area', name });
      if (!existing) {
        await Location.create({ type: 'area', name, label: area });
        areaCount++;
      }
    }

    console.log(`Seeded ${cityCount} new cities and ${areaCount} new areas.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedLocations();
