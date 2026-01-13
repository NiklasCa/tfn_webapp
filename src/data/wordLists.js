
export const SWEDISH_PLACES = [
    // Större städer
    "Stockholm", "Göteborg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping", "Helsingborg", "Jönköping", "Norrköping",
    "Lund", "Umeå", "Gävle", "Borås", "Södertälje", "Eskilstuna", "Halmstad", "Växjö", "Karlstad", "Sundsvall",

    // Mindre orter och städer (Utökad lista)
    "Alingsås", "Arvika", "Avesta", "Boden", "Bollnäs", "Eslöv", "Falkenberg", "Falköping", "Falun", "Filipstad",
    "Grums", "Hjo", "Hudiksvall", "Härnösand", "Hässleholm", "Höganäs", "Jokkmopp", "Kalmar", "Karlshamn", "Karlskrona",
    "Katrineholm", "Kiruna", "Kristinehamn", "Kumla", "Kungsbacka", "Kungälv", "Köping", "Laholm", "Landskrona", "Lidingö",
    "Lidköping", "Lindesberg", "Ljungby", "Ludvika", "Luleå", "Lycksele", "Lysekil", "Mariestad", "Mjölby", "Mora",
    "Motala", "Mölndal", "Nacka", "Nässjö", "Oskarshamn", "Piteå", "Ronneby", "Sandviken", "Sigtuna", "Simrishamn",
    "Skara", "Skellefteå", "Skövde", "Sollefteå", "Strängnäs", "Strömstad", "Säffle", "Säter", "Söderhamn", "Sölvesborg",
    "Tidaholm", "Torshälla", "Tranås", "Trelleborg", "Trollhättan", "Trosa", "Uddevalla", "Ulricehamn", "Vadstena", "Varberg",
    "Vetlanda", "Vimmerby", "Visby", "Ystad", "Åmål", "Ängelholm", "Örnsköldsvik", "Östersund",
    "Karesuando", "Sveg", "Vilhelmina", "Dorotea", "Arjeplog", "Sorsele", "Storuman", "Hemavan", "Tärnaby", "Funäsdalen",
    "Abisko", "Björkliden", "Riksgränsen", "Kittelfjäll", "Sälen", "Idre", "Malung", "Vansbro", "Leksand", "Rättvik",
    "Orsa", "Älvdalen", "Smedjebacken", "Hedemora", "Fagersta", "Norberg", "Sala", "Arboga", "Kungsör", "Hallstahammar",
    "Surahammar", "Oxelösund", "Nyköping", "Gnesta", "Flen", "Vingåker", "Finspång", "Valdemarsvik", "Söderköping", "Mantal",
    "Vadstena", "Boxholm", "Ödeshög", "Kisa", "Vimmerby", "Hultsfred", "Mönsterås", "Nybro", "Emmaboda", "Torsås",
    "Mörbylånga", "Borgholm", "Färjestaden", "Olofström", "Bromölla", "Osby", "Älmhult", "Markaryd", "Ljungby", "Värnamo",
    "Gislaved", "Gnosjö", "Vaggeryd", "Sävsjö", "Aneby", "Eksjö", "Tranås", "Gränna", "Mullsjö", "Habo", "Tibro", "Karlsborg",
    "Töreboda", "Gullspång", "Hova", "Laxå", "Askersund", "Hallsberg", "Kumla", "Lekeberg", "Degerfors", "Karlskoga", "Kil",
    "Forshaga", "Munkfors", "Hagfors", "Torsby", "Sunne", "Årjäng", "Eda", "Charlottenberg", "Bengtsfors", "Mellerud", "Vänersborg",
    "Lysekil", "Sotenäs", "Tanum", "Strömstad", "Munkedal", "Färgelanda", "Lilla Edet", "Ale", "Lerum", "Partille", "Härryda",
    "Mölndal", "Kungälv", "Stenungsund", "Tjörn", "Orust", "Herrljunga", "Vårgårda", "Bollebygd", "Mark", "Svenljunga", "Tranemo",
    // Balancing Additions (Q, X, Z, Å, Ä, Ö)
    "Kvikkjokk", "Zinkgruvan", "Vaxholm", "Yxlan", "Axvall", "Saxnäs", "Oxberg",
    "Åhus", "Åtvidaberg", "Åre", "Åsele", "Ånge", "Åsarna",
    "Älvsbyn", "Älvsjö", "Vännäs", "Järpen", "Särna", "Tällberg",
    "Överkalix", "Övertorneå", "Östhammar", "Öregrund", "Örkelljunga",
    // Expansion 50%
    "Båstad", "Danderyd", "Ekerö", "Enköping", "Gustavsberg", "Götene", "Hammarö", "Haparanda", "Heby", "Herrljunga",
    "Hällefors", "Hörby", "Höör", "Järfälla", "Klippan", "Knivsta", "Kramfors", "Krokom", "Leksand", "Lerum",
    "Lilla Edet", "Lomma", "Lysekil", "Malå", "Mark", "Mellerud", "Munkedal", "Munkfors", "Nordanstig", "Nordmaling",
    "Norrtälje", "Norsjö", "Nykvarn", "Nynäshamn", "Ockelbo", "Ovanåker", "Pajala", "Perstorp", "Ragunda", "Robertsfors",
    "Salem", "Sjöbo", "Skinnskatteberg", "Skurup", "Smedjebacken", "Solna", "Staffanstorp", "Stenungsund", "Storfors", "Storuman",
    "Strömsund", "Sundbyberg", "Sunne", "Svalöv", "Svedala", "Svenljunga", "Söderköping", "Sörusele", "Tanum", "Tibro",
    "Tierp", "Timrå", "Tjörn", "Tomelilla", "Torsby", "Tyresö", "Täby", "Töreboda", "Ulricehamn", "Upplands Väsby",
    "Upplands-Bro", "Vadstena", "Vaggeryd", "Valdemarsvik", "Vallentuna", "Vansbro", "Vara", "Vaxholm", "Vellinge", "Vilhelmina",
    "Värmdö", "Vårgårda", "Ydre", "Åre", "Årjäng", "Åsele", "Åstorp", "Åtvidaberg", "Älmhult", "Älvdalen",
    "Älvkarleby", "Älvsbyn", "Öckerö", "Ödeshög", "Överkalix", "Övertorneå"
];

export const WORLD_CITIES = [
    "Amsterdam", "Aten", "Bagdad", "Bangkok", "Barcelona", "Berlin", "Bogota", "Bryssel", "Budapest", "Buenos Aires",
    "Kairo", "Kapstaden", "Chicago", "Köpenhamn", "Dubai", "Dublin", "Helsingfors", "Hongkong", "Istanbul", "Jakarta",
    "Jerusalem", "Johannesburg", "Kiev", "Lagos", "Las Vegas", "Lissabon", "London", "Los Angeles", "Madrid", "Manila",
    "Melbourne", "Mexico City", "Milano", "Moskva", "Mumbai", "München", "Nairobi", "New Delhi", "New York", "Oslo",
    "Paris", "Peking", "Prag", "Reykjavik", "Rio de Janeiro", "Rom", "San Francisco", "Santiago", "Seoul", "Shanghai",
    "Singapore", "Sydney", "Teheran", "Tel Aviv", "Tokyo", "Toronto", "Vancouver", "Wien", "Warszawa", "Zürich",
    // Expanded List
    "Addis Abeba", "Algiers", "Amman", "Ankara", "Antwerpen", "Auckland", "Baku", "Beirut", "Belgrad", "Bern",
    "Bilbao", "Birmingham", "Boston", "Bratislava", "Brisbane", "Bukarest", "Casablanca", "Chengdu", "Dakar", "Dallas",
    "Damaskus", "Dar es Salaam", "Denver", "Detroit", "Doha", "Düsseldorf", "Edinburgh", "Florens", "Frankfurt", "Fukuoka",
    "Glasgow", "Guangzhou", "Hamburg", "Hanoi", "Harare", "Havanna", "Ho Chi Minh", "Houston", "Hyderabad", "Islamabad",
    "Karachi", "Kathmandu", "Khartoum", "Kinshasa", "Kuala Lumpur", "Kuwait", "Kyoto", "Lima", "Liverpool", "Lyon",
    "Manchester", "Marseille", "Miami", "Minsk", "Montreal", "Napoli", "Osaka", "Ottawa", "Perth", "Philadelphia",
    "Phnom Penh", "Phoenix", "Portland", "Riga", "Riyadh", "Rotterdam", "San Diego", "Sao Paulo", "Seattle", "Sevilla",
    "Shenzhen", "Sofia", "St. Petersburg", "Stuttgart", "Taipei", "Tallinn", "Tasjkent", "Tbilisi", "Tripoli", "Tunis",
    "Turin", "Valencia", "Vilnius", "Washington", "Wellington", "Zagreb",
    // Balancing Additions
    "Quito", "Quebec", "Queenstown", "Qingdao",
    "Xi'an", "Xiamen", "Alexandria", "Bordeaux", "Halifax", "Luxor", "Oaxaca",
    "Wuhan", "Winnipeg", "Windhoek", "Warszawa",
    "Zanzibar", "Zaragoza", "Graz", "La Paz", "Suez", "Zhengzhou",
    "Åbo", "Köln",
    // Expansion 50%
    "Abidjan", "Abu Dhabi", "Accra", "Adelaide", "Ahmedabad", "Aleppo", "Alexandria", "Almaty", "Antananarivo", "Asuncion",
    "Bagdad", "Bamako", "Bandung", "Bangalore", "Barranquilla", "Basra", "Belfast", "Belgrad", "Belo Horizonte", "Bengaluru",
    "Bergen", "Birmingham", "Bishkek", "Bissau", "Bogota", "Brasilia", "Brazzaville", "Brisbane", "Brno", "Bucharest",
    "Busan", "Cali", "Canberra", "Caracas", "Cebu", "Chengdu", "Chittagong", "Chongqing", "Colombo", "Cordoba",
    "Curitiba", "Daegu", "Dalian", "Dammamin", "Davao", "Dhaka", "Djibouti", "Dongguan", "Douala", "Durban",
    "Dusjanbe", "Edmonton", "Faisalabad", "Fez", "Fortaleza", "Freetown", "Gaborone", "Gdansk", "Geneve", "Georgetown",
    "Giza", "Goa", "Guadalajara", "Guatemala City", "Guayaquil", "Haifa", "Hangzhou", "Harbin", "Hiroshima", "Homs",
    "Incheon", "Indore", "Isfahan", "Izmir", "Jaipur", "Jeddah", "Jerevan", "Jinan", "Kabul", "Kampala"
];

export const NAMES = [
    // Svenska Namn (~200+)
    "Alexander", "Alexandra", "Albin", "Alfred", "Alice", "Alicia", "Alma", "Alva", "Amanda", "Anders", "Andreas", "Anna", "Anton", "Aron", "Arvid", "Astrid", "Axel",
    "Bengt", "Berit", "Bertil", "Birgitta", "Björn", "Bo", "Börje",
    "Camilla", "Carina", "Carl", "Caroline", "Cecilia", "Charlotta", "Christian", "Christoffer", "Clara", "Cornelia",
    "Daniel", "David", "Ebba", "Edvin", "Elias", "Elin", "Elisabeth", "Ella", "Ellen", "Elsa", "Emil", "Emilia", "Emma", "Erik", "Eva", "Evelina",
    "Felicia", "Felix", "Filip", "Fredrik", "Freja", "Frida",
    "Gabriel", "Greta", "Gunnar", "Gunilla", "Gustav", "Göran",
    "Hanna", "Hannes", "Hans", "Harry", "Hedda", "Helena", "Henrik", "Hilda", "Hjalmar", "Hugo", "Håkan",
    "Ida", "Inger", "Ingrid", "Isak", "Isabelle", "Ivar",
    "Jacob", "Jan", "Jenny", "Jesper", "Joakim", "Johan", "Johanna", "Jonas", "Jonathan", "Josefin", "Julia",
    "Karin", "Karl", "Karolina", "Katarina", "Kerstin", "Kevin", "Klara", "Klas", "Kristina", "Kristoffer",
    "Lars", "Leif", "Lena", "Lennart", "Leo", "Liam", "Lilly", "Linda", "Linnea", "Linus", "Lisa", "Liselott", "Love", "Lovisa", "Lucas", "Ludvig",
    "Madeleine", "Magnus", "Maja", "Malin", "Marcus", "Margareta", "Maria", "Marie", "Martin", "Matilda", "Mats", "Mattias", "Max", "Melker", "Mikael", "Moa", "Molly", "Märta",
    "Nils", "Noah", "Niklas", "Nora", "Nova",
    "Olle", "Olivia", "Olof", "Oscar",
    "Patrik", "Per", "Peter", "Petra", "Petter", "Pia", "Pontus",
    "Rasmus", "Rebecca", "Rickard", "Robert", "Robin", "Roger", "Rolf", "Ronja", "Rune",
    "Saga", "Samuel", "Sandra", "Sara", "Sebastian", "Signe", "Sigrid", "Simon", "Siv", "Sofia", "Sofie", "Solveig", "Staffan", "Stefan", "Stella", "Sten", "Stig", "Stina", "Sune", "Susanne", "Sven",
    "Tage", "Thea", "Theodor", "Therese", "Thomas", "Tindra", "Tobias", "Tom", "Tomas", "Tor", "Torbjörn", "Tove", "Tyra",
    "Ulf", "Ulla", "Ulrika",
    "Vera", "Veronica", "Victor", "Victoria", "Vidar", "Viggo", "Viktor", "Vilgot", "Vilhelm", "Vilma", "Vincent",
    "Walter", "Wilhelm", "Wilma", "William",
    "Ylva", "Yvonne",
    "Åke", "Åsa",
    "Örjan",
    // Efternamn Svenska
    "Andersson", "Johansson", "Karlsson", "Nilsson", "Eriksson", "Larsson", "Olsson", "Persson", "Svensson", "Gustafsson",
    "Pettersson", "Jonsson", "Jansson", "Hansson", "Bengtsson", "Jönsson", "Lindberg", "Jakobsson", "Magnusson", "Olofsson",
    "Lindström", "Lindqvist", "Lindgren", "Axelsson", "Berg", "Bergström", "Lundberg", "Lind", "Lundgren", "Lundqvist",
    "Mattsson", "Berglund", "Fredriksson", "Sandberg", "Henriksson", "Forsberg", "Sjöberg", "Walin", "Engström", "Eklund",
    "Danielsson", "Lundin", "Håkansson", "Gunnarsson", "Bergman", "Samuelsson", "Fransson", "Wikström", "Tobias", "Nyberg",

    // Europeiska Namn (Central/Öst/Väst/Syd - Blandat) ~150+
    "Adalbert", "Adriana", "Agnieszka", "Alessandro", "Alessio", "Alina", "Amelie", "Andre", "Angelo", "Antonio", "Anya",
    "Bartosz", "Bazyli", "Bela", "Benedikt", "Bianca", "Bogdan", "Boris", "Bruno",
    "Carlo", "Carmen", "Casper", "Caterina", "Cecile", "Cezary", "Charlotte", "Chiara", "Claude", "Claudia", "Constantin",
    "Dagmar", "Darius", "Dimitri", "Dominik", "Dorota", "Dragana",
    "Elena", "Elio", "Emilija", "Enzo", "Etienne", "Eva",
    "Fabian", "Fabio", "Federico", "Fernando", "Florian", "Francesco", "Franz", "Friedrich",
    "Gabriel", "Gabor", "Gaston", "Gerhard", "Gianluca", "Giovanni", "Giulia", "Giuseppe", "Goran", "Grazyna", "Guillaume",
    "Hans", "Heidi", "Heinrich", "Helga", "Hermann", "Hugo",
    "Igor", "Ilona", "Ioannis", "Irina", "Istvan", "Ivan", "Ivana",
    "Jacques", "Jakub", "Janusz", "Jaroslav", "Javier", "Jean", "Jekaterina", "Jelena", "Jiri", "Joanna", "Johannes", "Jose", "Josef", "Juan", "Jules", "Julia", "Jurij", "Justyna",
    "Kacper", "Karol", "Kaspar", "Katarzyna", "Katja", "Klaus", "Konrad", "Krzysztof",
    "Laszlo", "Laurent", "Lena", "Leo", "Leon", "Leonardo", "Lorenzo", "Luca", "Lucia", "Luis", "Lukasz", "Lutz",
    "Maciej", "Magdalena", "Maja", "Malgorzata", "Manuel", "Marc", "Marcel", "Marco", "Marek", "Maria", "Mario", "Marta", "Martina", "Mateusz", "Matthias", "Maxime", "Michal", "Miguel", "Milan", "Milos", "Miroslav", "Monika",
    "Nadia", "Natalia", "Nicola", "Nikolai", "Nino",
    "Oksana", "Olga", "Oliver", "Olivier",
    "Paolo", "Pascal", "Patrick", "Paul", "Pavel", "Pedro", "Petra", "Pierre", "Piotr", "Przemyslaw",
    "Rafael", "Rainer", "Raul", "Rene", "Ricardo", "Roberto", "Roman", "Rosa", "Roxana",
    "Sabine", "Salvatore", "Santiago", "Saskia", "Sergei", "Sergio", "Silvia", "Simone", "Slavomir", "Sophie", "Stanislav", "Stefan", "Stefano", "Svetlana",
    "Tanya", "Tatiana", "Tereza", "Thierry", "Thomas", "Tibor", "Tomasz",
    "Udo", "Ursula", "Uwe",
    "Valentina", "Valerie", "Vanessa", "Vasil", "Veronika", "Victor", "Vladimir", "Vladislav",
    "Werner", "Wojciech", "Wolfgang",
    "Xavier",
    "Yaroslav", "Yves",
    "Zdenek", "Zofia", "Zoltan", "Zoran", "Zuzana",
    // Expansion 50% (European)
    "Adelina", "Adriano", "Agatha", "Albina", "Aleksander", "Anastasia", "Anatoli", "Andrzej", "Aneta", "Angelina",
    "Antonina", "Artem", "Aurelia", "Balazs", "Balthasar", "Barnabas", "Beatriz", "Benedek", "Bettina", "Blanka",
    "Bogumil", "Bojan", "Borislav", "Branislav", "Brigitte", "Carla", "Carmela", "Casimiro", "Catalina", "Celestina",
    "Ciprian", "Clarissa", "Cosimo", "Cristina", "Dalibor", "Danica", "Danilo", "Dante", "Daria", "Delia",
    "Desislav", "Detlef", "Dietmar", "Dimitrios", "Dina", "Dobromir", "Dolores", "Dragan", "Dubravka", "Edita",
    "Eleonora", "Elzbieta", "Emilian", "Esteban", "Eugenio", "Ewa", "Fabiana", "Fabrizio", "Fausto", "Federica",
    "Ferdinand", "Fiorella", "Flavia", "Francesca", "Francisco", "Gaetano", "Galina", "Gennaro", "Georgios", "Geraldo",
    "Giacomo", "Gianna", "Giselle", "Giuliana", "Goran", "Gordana", "Grazia", "Grigor", "Guido", "Gunther",
    "Halina", "Hartmut", "Helena", "Helmut", "Horst", "Ignazio", "Ildiko", "Ileana", "Imre", "Ioana",
    "Jacek", "Jadwiga", "Jana", "Jarmila", "Jaromir", "Joaquin", "Jolanta", "Jozef", "Julian", "Juraj",
    "Kalina", "Kamen", "Karolina", "Kazimierz", "Kinga", "Kiril", "Klaudia", "Konstantin", "Kornelia", "Krasimir",
    "Ladislav", "Larisa", "Lavinia", "Lech", "Lidia", "Liliana", "Liudmila", "Liviu", "Ljubomir", "Loretta",
    "Luciana", "Ludmila", "Luigi", "Luiz", "Lukas", "Lyubomir", "Malin", "Manuela", "Marcelo", "Mariana",
    "Marija", "Marina", "Maris", "Marius", "Marko", "Martine", "Massimo", "Matteo", "Mauro", "Melinda",
    "Mercedes", "Milena", "Mircea", "Mirela", "Mirko", "Mladen", "Nadine", "Nandor", "Natasa", "Nebojsa",
    "Nenad", "Nicoletta", "Niels", "Nikitas", "Nikolina", "Ognjen", "Oleg", "Olimpia", "Orsolya", "Othmar",
    "Otmar", "Ottilia", "Panagiotis", "Paola", "Patrizia", "Paulette", "Pavla", "Pietro", "Plamen", "Polina",
    "Predrag", "Radmila", "Radoslav", "Radu", "Raffaele", "Raimund", "Raisa", "Ramona", "Raquel", "Rastislav",
    "Renata", "Renato", "Riegina", "Rodolfo", "Romana", "Romeo", "Rosalia", "Rosario", "Rosen", "Rostislav",
    "Roxana", "Rozalia", "Ruben", "Rumen", "Ruslan", "Sabrina", "Salvador", "Sandor", "Sanja", "Saul",
    "Saverio", "Savvas", "Sebastiano", "Sergej", "Severin", "Siegfried", "Silke", "Silvana", "Simona", "Slavka",
    "Slobodan", "Sonia", "Sorin", "Spas", "Spiro", "Srecko", "Stamatia", "Stanimir", "Stanka", "Stavros",
    "Stjepan", "Stojan", "Svenja", "Szilvia", "Tamara", "Tania", "Taras", "Tatyana", "Teodora", "Teofilo",
    "Terezia", "Thalia", "Thekla", "Theodoros", "Tihomir", "Timea", "Tiziano", "Todor", "Tomislav", "Traian",
    "Umberto", "Ute", "Vaclav", "Valdemar", "Valentin", "Valeriu", "Vanda", "Vasiliki", "Velimir", "Venceslav",
    "Vera", "Vesna", "Vincenzo", "Viola", "Viorica", "Vittorio", "Vlad", "Vlasta", "Wanda", "Wieslaw",
    "Wilfried", "Wolf", "Xenia", "Yannick", "Yolanda", "Yuri", "Zarko", "Zivko", "Zlatko", "Zsolt",

    // "Exotiska" / Internationella / Övriga Världen ~40+
    "Aarav", "Abdullah", "Aiko", "Ali", "Amara", "Amin", "Arjun", "Ayesha",
    "Bao", "Barack", "Bilal",
    "Chen", "Chiyo",
    "Dalia", "Deepak",
    "Fatima",
    "Hassan", "Hiroshi", "Hussein",
    "Ibrahim", "Indira",
    "Jabari", "Jamal", "Jing", "Jun",
    "Kaori", "Kenji", "Khaled", "Kwame",
    "Lakshmi", "Leila", "Li", "Ling",
    "Mahmoud", "Mei", "Min", "Mohammed", "Mustafa",
    "Nia", "Noor",
    "Omar",
    "Priya",
    "Ravi", "Rania", "Reza",
    "Sakura", "Samira", "Sanjay", "Satoshi", "Sayuri", "Shin", "Sun",
    "Tariq",
    "Wei", "Wu",
    "Xi",
    "Yara", "Yasmin", "Yoko", "Yuki", "Yuna", "Yusuf",
    "Zahra", "Zayn",
    // Expansion 50% (Exotic/International)
    "Aaliyah", "Aarush", "Abbas", "Aditya", "Akira", "Akram", "Amir", "Ananya", "Anil", "Arin",
    "Asa", "Asuka", "Ayumi", "Aziz", "Bahir", "Bao", "Bintou", "Bodhi", "Chandra", "Chang",
    "Chin", "Dae", "Daiki", "Dakarai", "Deshi", "Dev", "Dinesh", "Diya", "Ebo", "Emi",
    "Enid", "Esra", "Farah", "Femi", "Gamal", "Gita", "Habib", "Hadi", "Hana", "Haruto",
    "Hashim", "Hayato", "Hikari", "Hina", "Hiro", "Hoshi", "Idris", "Iman", "Ines", "Ishaan",
    "Jabir", "Jafari", "Jamil", "Jiang", "Jiro", "Kaito", "Kali", "Kamal", "Kania", "Kato",
    "Kenze", "Keiko", "Kenta", "Kofi", "Koji", "Kunal", "Kwabena", "Leilani", "Liang", "Lina",
    "Liu", "Liyana", "Lu", "Malak", "Malik", "Manish", "Masako", "Mei-Ling", "Ming", "Mohit",
    "Muna", "Nabil", "Nadira", "Nala", "Naoki", "Narayan", "Nasim", "Naveen", "Niam", "Ning",
    "Nori", "Nur", "Obi", "Omari", "Pardis", "Parvati", "Ping", "Qadir", "Qing", "Rajan",
    "Rashid", "Riku", "Rina", "Rohan", "Rong", "Ryu", "Saad", "Sade", "Safiya", "Said",
    "Salim", "Samar", "Sami", "Sana", "Sara", "Sato", "Shankar", "Shanti", "Shu",
    // Balancing Additions
    "Quinn", "Quentin", "Quintus", "Qasim",
    "Xander", "Xenia", "Sixten", "Dexter", "Beatrix", "Maximilian", "Roxana",
    "Wera", "Waldemar", "Wendy", "Winston", "Wilhelmina",
    "Zara", "Zelda", "Zeke", "Zlatan", "Zoe", "Zakarias", "Inez", "Aziz",
    "Åslög", "Ängla", "Östen", "Öjvind",
    // Expansion 50%
    "Aaron", "Abel", "Ada", "Adina", "Adolf", "Agaton", "Agnes", "Ahmad", "Aina", "Albert",
    "Algot", "Allan", "Alvar", "Amal", "Amir", "Anja", "Ann", "Anneli", "Annette", "Annika",
    "Antonia", "Arne", "Assar", "Asta", "August", "Aurora", "Barbro", "Beata", "Beatrice", "Beda",
    "Bella", "Benjamin", "Bernhard", "Bernt", "Bert", "Betty", "Birgit", "Bjarne", "Björn", "Bodil",
    "Boris", "Britt", "Britta", "Bror", "Carin", "Carla", "Carlos", "Casper", "Catharina", "Catrin",
    "Charlotta", "Christina", "Claes", "Clarence", "Conny", "Dag", "Dagny", "Daisy", "Dan", "Daniella",
    "Dante", "Dennis", "Diana", "Dick", "Disa", "Doris", "Douglas", "Edith", "Edmund", "Edvard",
    "Egon", "Eira", "Ejnar", "Elena", "Elina", "Elis", "Elise", "Ellinor", "Elvira", "Emanuel",
    "Emelie", "Enar", "Erland", "Erling", "Erna", "Esbjörn", "Eskil", "Ester", "Eugen", "Evert",
    "Fanny", "Fatima", "Feliz", "Fia", "Filippa", "Folke", "Frank", "Frans", "Fred", "Frej",
    "Fritiof", "Gert", "Gertrud", "Gittan", "Glenn", "Gerd", "Gerda", "Gilbert", "Gina", "Gisela",
    "Gittan", "Gloria", "Gottfrid", "Grace", "Gull", "Gullan", "Gullevi", "Gun", "Gunborg", "Gundla",
    "Gunhild", "Gunnel", "Gunni", "Gunvor", "Gurli", "Gustaf", "Gösta", "Göte", "Harald", "Harriet"
];

const ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateRandomCode = (minLength = 3, maxLength = 8, useLetters = true, useNumbers = true, useHyphen = true) => {
    // Determine charset based on flags
    let chars = "";
    if (useLetters) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useNumbers) chars += "0123456789";

    // Safety fallback: if nothing selected, use X
    if (chars.length === 0) chars = "X";

    // Add hyphen if requested
    if (useHyphen) chars += "-";

    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let res = "";

    for (let i = 0; i < length; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Clean up hyphens
    if (useHyphen) {
        res = res.replace(/--+/g, '-');
        if (res.startsWith('-')) res = (useLetters ? 'A' : (useNumbers ? '1' : 'X')) + res.substring(1);
        if (res.endsWith('-')) res = res.substring(0, res.length - 1) + (useNumbers ? '9' : (useLetters ? 'Z' : 'X'));
    }

    return res.toUpperCase();
};

export const generateMGRS = () => {
    // 1. Grid Zone Designator (GZD)
    // 1-60 + Letter (C-X, omitting I, O)
    const zoneNum = Math.floor(Math.random() * 60) + 1;
    const bands = "CDEFGHJKLMNPQRSTUVWXX";
    const band = bands.charAt(Math.floor(Math.random() * bands.length));

    // 2. 100,000-meter Square Identifier
    // Two letters (A-Z, omitting I, O)
    const sqChars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const sq1 = sqChars.charAt(Math.floor(Math.random() * sqChars.length));
    const sq2 = sqChars.charAt(Math.floor(Math.random() * sqChars.length));

    // 3. Numerical Location (Easting + Northing)
    // Precision: 3+3 (100m) to 5+5 (1m)
    const precision = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5

    // Helper for random digits
    const rn = (len) => {
        let res = "";
        const chars = "0123456789";
        for (let i = 0; i < len; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
        return res;
    }

    const easting = rn(precision);
    const northing = rn(precision);

    // Format: "33V UE 12345 67890" (With spaces for readability)
    return `${zoneNum}${band} ${sq1}${sq2} ${easting} ${northing}`;
};

export const getWordPool = (selectedCategories, codeMin = 3, codeMax = 8, useLetters = true, useNumbers = true, useHyphen = true, excludeSwedish = false) => {
    let pool = [];

    const categories = new Set(selectedCategories);

    if (categories.has('places_se')) {
        pool = pool.concat(SWEDISH_PLACES);
    }
    if (categories.has('cities_world')) {
        pool = pool.concat(WORLD_CITIES);
    }
    if (categories.has('names')) {
        pool = pool.concat(NAMES);
    }
    if (categories.has('codes')) {
        // Generate a batch of transient codes to pick from
        // Add enough to allow for some gameplay without regenerating pool instantly
        for (let i = 0; i < 50; i++) {
            pool.push(generateRandomCode(codeMin, codeMax, useLetters, useNumbers, useHyphen));
        }
    }
    if (categories.has('mgrs')) {
        // Generate batch of MGRS
        for (let i = 0; i < 20; i++) {
            pool.push(generateMGRS());
        }
    }

    // Fallback if empty
    if (pool.length === 0) {
        return ["SANDBOX"]; // Fallback safe word
    }

    // Filter out Swedish characters if requested (for NATO mode)
    if (excludeSwedish) {
        pool = pool.filter(w => !/[ÅÄÖåäö]/.test(w));
    }

    return pool;
};
