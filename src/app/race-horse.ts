
export const HORSETYPES = {
  SHORT_RACE: 0,
  MEDIUM_RACE: 1,
  LONG_RACE: 2,
};
export const PIXELS_PER_FURLONG = 250; //780;
export const HORSES_PER_PLAYER = 5;
export const INITIAL_PLAYER_FUNDS = 250;

let _horseNames = [
  "Abaccus",
  "Acapella",
  "Ace",
  "Ace of Spades",
  "Acer",
  "Acorn",
  "Acromantula",
  "Adagio",
  "Adat",
  "Adigo",
  "Aeris",
  "Aerosmith",
  "Aferditie",
  "Afterglow",
  "Aftershock",
  "Agape",
  "Ahlerich",
  "Ahwa",
  "Aida",
  "Aidan",
  "Aiko",
  "Airborne",
  "Aitch",
  "Akasha",
  "Akhademy",
  "Alacazam",
  "Alanah",
  "Albus",
  "Alcatraz",
  "Alexa",
  "Alias",
  "Alizay",
  "Allegra",
  "Allegria",
  "Allegro",
  "Allouette",
  "Alomar",
  "Altair",
  "Altivo",
  "Amadeus",
  "Amanda",
  "Amazing Grace",
  "Amazon",
  "Ambara",
  "Ameera",
  "Amethyst",
  "Amfortas",
  "Ananda",
  "Anchor",
  "Andale",
  "Andrejana",
  "Angelfire",
  "Angelo",
  "Anita",
  "Anna Bell",
  "Annabel",
  "Annabelle",
  "Anthem",
  "Anziyan",
  "Apache",
  "Aphrodite",
  "Apollo",
  "Appalooa",
  "Appichi",
  "Applejack",
  "Applejax",
  "Applewood",
  "April",
  "Aqua",
  "Aquax",
  "Aquaxi",
  "Aquaxius",
  "Aragon",
  "Aramis",
  "Arcadia",
  "Archer",
  "Archie",
  "Areo",
  "Argo",
  "Ariadne",
  "Arial",
  "Aries",
  "Aristo",
  "Arizona",
  "Arrow",
  "Artemis",
  "Artex",
  "Asgard",
  "Ashes",
  "Ashka",
  "Ashleigh",
  "Aspen",
  "Athena",
  "Athos",
  "Atom",
  "Audrey",
  "Aurel",
  "Aurora",
  "Autumn",
  "Avasha",
  "Avenida",
  "Averti",
  "Aviance",
  "Ayla",
  "Azur",
  "Azure",
  "Babbelute",
  "Babe",
  "Badger",
  "Bailey",
  "Baldemar",
  "Baloo",
  "Bama",
  "Bandana",
  "Banner",
  "Baringr",
  "Barkley",
  "Barleda",
  "Barney",
  "Barnum",
  "Baron",
  "Barq",
  "Barreness",
  "Barron",
  "Bashful",
  "Basil",
  "Basilas",
  "Batovian",
  "Batty",
  "Baxter",
  "Bayard",
  "Bayjour",
  "Baymont",
  "Bear",
  "Beau",
  "Beck",
  "Beigh",
  "Bekki",
  "Bellator",
  "Ben",
  "Benjamin",
  "Benson",
  "Bento",
  "Bermuda",
  "Bijoux",
  "Billie",
  "Billy",
  "Bindi",
  "Bindy",
  "Biscuit",
  "Bits",
  "Bitsy",
  "Black Jack",
  "Black Rose",
  "Black Shadows",
  "Black Zephyr",
  "Blackhawk",
  "Blanca",
  "Blarney",
  "Blaster",
  "Blaze",
  "Blazing Comet",
  "Bliss",
  "Blitz",
  "Blitzen",
  "Blizzard",
  "Blossom",
  "Blue",
  "Blue Angel",
  "Blue Eyes",
  "Blue Moon",
  "Bluebell",
  "Bluegrass",
  "Blustery",
  "Bobbie",
  "Bobby",
  "Bojangles",
  "Bolaro",
  "Bolero",
  "Bolt",
  "Bonzo",
  "Boo",
  "Booger",
  "Boomer",
  "Boomerang",
  "Bossinova",
  "Bossy",
  "Boston",
  "Bounty",
  "Bourbon",
  "Bracken",
  "Bramble",
  "Branagan",
  "Brandon",
  "Brandy",
  "Brat",
  "Brave",
  "Braveheart",
  "Bravo",
  "Breeze",
  "Breezy",
  "Breman",
  "Brenner",
  "Briarwave",
  "Brie",
  "Brigham",
  "Britt",
  "Brocco",
  "Broker",
  "Bronson",
  "Brook",
  "Brooke",
  "Bruce",
  "Bruiser",
  "Bruno",
  "Brutus",
  "Bubbles",
  "Bubs",
  "Buck",
  "Buckshot",
  "Buckwheat",
  "Bucky",
  "Bud",
  "Buddy",
  "Bugs",
  "Bullet",
  "Bullseye",
  "Bumbles",
  "Bumper",
  "Busco",
  "Buster",
  "Butter",
  "Buzz",
  "Cade",
  "Cadence",
  "Caeser",
  "Caine",
  "Cajun",
  "Calico",
  "Calimero",
  "Cally",
  "Calua",
  "Calvin",
  "Cameo",
  "Camoren",
  "Campari",
  "Campino",
  "Candy",
  "Capella",
  "Caper",
  "Capitaine",
  "Captain",
  "Carmel",
  "Carmella",
  "Carmen",
  "Carumba",
  "Carver",
  "Casanova",
  "Cascade",
  "Casey",
  "Cash",
  "Caspar",
  "Casper",
  "Caspian",
  "Cassidy",
  "Cassie",
  "Castaway",
  "Cavier",
  "Caz",
  "Ceasar",
  "Cedar",
  "Ceffyl",
  "Celandine",
  "Celeste",
  "Cellini",
  "Century",
  "Cera",
  "Ceres",
  "Ceris",
  "Cham",
  "Chamber",
  "Chamlan",
  "Champagne",
  "Champane",
  "Champion",
  "Chance",
  "Chancer",
  "Chancey",
  "Channel",
  "Chaos",
  "Charger",
  "Chargey",
  "Charisma",
  "Charity",
  "Charlene",
  "Charles",
  "Charlie",
  "Charm",
  "Charmed",
  "Charmer",
  "Charming",
  "Chase",
  "Chebe",
  "Checkers",
  "Cheeky",
  "Chelsea",
  "Cherish",
  "Cherokee",
  "Cheska",
  "Chester",
  "Chesterfield",
  "Chevy",
  "Chex",
  "Cheyanne",
  "Cheyenne",
  "Chief",
  "Chimera",
  "Chino",
  "Chinook",
  "Chip",
  "Chloe",
  "Chocolate",
  "Choice",
  "Chrome",
  "Chuck",
  "Chuckles",
  "Cider",
  "Cimarron",
  "Cimeron",
  "Cinamon",
  "Cinders",
  "Cindy",
  "Cinnamon",
  "Cirrus",
  "Cisco",
  "Clancy",
  "Clemantine",
  "Cleo",
  "Clifford",
  "Cloe",
  "Cloud",
  "Cloven",
  "Clover",
  "Cluster",
  "Clyde",
  "Coal",
  "Cobalt",
  "Coco",
  "Cody",
  "Colby",
  "Cole",
  "Colin",
  "Colorado",
  "Coltyn",
  "Columbo",
  "Comanche",
  "Comet",
  "Condor",
  "Congarie",
  "Conker",
  "Conquest",
  "Conrad",
  "Cookie",
  "Copper",
  "Corey",
  "Cosmo",
  "Cotton",
  "Cougar",
  "Count",
  "Country Legend",
  "Coyote",
  "Crackerjack",
  "Crazy",
  "Cream",
  "Creole",
  "Cricket",
  "Crimson",
  "Cruise",
  "Cruser",
  "Crystal",
  "Culver",
  "Cupid",
  "Curious",
  "Curiso",
  "Curley",
  "Curly",
  "Curtis",
  "Custer",
  "Cutter",
  "Cyclone",
  "Cymba",
  "Cyrus",
  "Dagger",
  "Daggers",
  "Daisy",
  "Dakota",
  "Dale",
  "Dallas",
  "Dalton",
  "Dameon",
  "Damien",
  "Damsel",
  "Dancer",
  "Dandi",
  "Dandy",
  "Dani",
  "Daniel",
  "Danny",
  "Darby",
  "Darcy",
  "Daredevil",
  "Darius",
  "Dark Blossom",
  "Dark Feet",
  "Dark Ranger",
  "Dark Sparkle",
  "Dark Sparks",
  "Dark Stallion",
  "Dark Step",
  "Darkbolt",
  "Darkfeet",
  "Darkfire",
  "Darkflame",
  "Darkflash",
  "Darkheart",
  "Darklight",
  "Darkmane",
  "Darkness",
  "Darksilver",
  "Dasher",
  "Dava",
  "Davis",
  "Dawn",
  "Dawson",
  "Dax",
  "Daybreak",
  "Dayspring",
  "Daze",
  "Dazzle",
  "Dazzler",
  "Deacon",
  "Decker",
  "Delia",
  "Delilah",
  "Delphine",
  "Delta",
  "Demi",
  "Deputy",
  "Derby",
  "Descaro",
  "Desirae",
  "Desire",
  "Destiny",
  "Deuce",
  "Devi",
  "Devious",
  "Devon",
  "Dex",
  "Dexter",
  "Diablo",
  "Diago",
  "Digger",
  "Dillan",
  "Dilly",
  "Dimple",
  "Dixie",
  "Dixieland",
  "Dobber",
  "Dobbin",
  "Dolby",
  "Dollar",
  "Domingo",
  "Dominion",
  "Domino",
  "Donner",
  "Dorn",
  "Douglas",
  "Doulton",
  "Draco",
  "Draft",
  "Dragonfly",
  "Dreamer",
  "Drift",
  "Drifter",
  "Drue",
  "Dryad",
  "Duchess",
  "Duke",
  "Dundee",
  "Dune",
  "Durack",
  "Duran",
  "Durango",
  "Duranimo",
  "Duskany",
  "Duster",
  "Dusty",
  "Dutchess",
  "Dylan",
  "Dynamite",
  "Eagle",
  "Earthquake",
  "Eben",
  "Ebony",
  "Echo",
  "Eclipse",
  "Edelweiss",
  "Eden",
  "Edge",
  "Edgy",
  "El Dorado",
  "El Paso",
  "Eldorado",
  "Elegance",
  "Elessar",
  "Elipsis",
  "Elita",
  "Elizabeth",
  "Ellie",
  "Elliot",
  "Eloquence",
  "Elusive",
  "Ely",
  "Elzar",
  "Emanon",
  "Ember",
  "Embrace",
  "Emerald",
  "Emmet",
  "Emmy",
  "Empire",
  "Empress",
  "Enammored",
  "Enchanted",
  "Enchantress",
  "Encore",
  "Enigma",
  "Epic",
  "Epona",
  "Equinox",
  "Erika",
  "Eros",
  "Esazia",
  "Esprit",
  "Esquivo",
  "Essen",
  "Esteem",
  "Etch",
  "Eterial",
  "Eternal",
  "Etheria",
  "Evan",
  "Everlast",
  "Evita",
  "Excalibur",
  "Explorer",
  "Fair Maiden",
  "Faith",
  "Falcon",
  "Falcor",
  "Fallacy",
  "Fandango",
  "Fantasia",
  "Fantsi",
  "Fanul",
  "Fara",
  "Farnley",
  "Faruq",
  "Fast Blossom",
  "Fast Feet",
  "Fast Ranger",
  "Fast Sparks",
  "Fast Stallion",
  "Fast Step",
  "Fastbolt",
  "Fastfeet",
  "Fastfire",
  "Fastflame",
  "Fastflash",
  "Fastheart",
  "Fastlight",
  "Fastmane",
  "Fastsilver",
  "Fawny",
  "Fay",
  "Fearghus",
  "Fedora",
  "Felena",
  "Felicity",
  "Feline",
  "Felix",
  "Felta",
  "Fencer",
  "Fergus",
  "Ferris",
  "Festus",
  "Fidget",
  "Fidler",
  "Finnigan",
  "Fire",
  "Firebolt",
  "Firefly",
  "Firenze",
  "Fitz",
  "Flame",
  "Flames",
  "Flare",
  "Flash",
  "Flash Blossom",
  "Flash Feet",
  "Flash Ranger",
  "Flash Sparkle",
  "Flash Sparks",
  "Flash Stallion",
  "Flash Step",
  "Flashbolt",
  "Flashdance",
  "Flashfeet",
  "Flashfire",
  "Flashflame",
  "Flashheart",
  "Flashlight",
  "Flashmane",
  "Flashsilver",
  "Fleet",
  "Fleet Blossom",
  "Fleet Feet",
  "Fleet Ranger",
  "Fleet Sparks",
  "Fleet Stallion",
  "Fleet Step",
  "Fleetbolt",
  "Fleetfeet",
  "Fleetfire",
  "Fleetflame",
  "Fleetflash",
  "Fleetheart",
  "Fleetlight",
  "Fleetmane",
  "Fleetsilver",
  "Flicka",
  "Flicker",
  "Flight Blossom",
  "Flight Feet",
  "Flight Ranger",
  "Flight Sparkle",
  "Flight Sparks",
  "Flight Stallion",
  "Flight Step",
  "Flightbolt",
  "Flightfeet",
  "Flightfire",
  "Flightflame",
  "Flightflash",
  "Flightheart",
  "Flightlight",
  "Flightmane",
  "Flightsilver",
  "Flint",
  "Floyd",
  "Flurry",
  "Flyte",
  "Folly",
  "Fonzie",
  "Forest",
  "Forte",
  "Fox",
  "Foxfire",
  "Foxtail",
  "Frankie",
  "Franklin",
  "Frazzle",
  "Freckles",
  "Freedom",
  "Fritz",
  "Frosty",
  "Fuerte",
  "Furiette",
  "Fury",
  "Gabriel",
  "Gadget",
  "Gage",
  "Gaia",
  "Gaiety",
  "Galadrial",
  "Galadriel",
  "Galadrielle",
  "Galaxy",
  "Galino",
  "Galistic",
  "Gallagher",
  "Gallamist",
  "Gallena",
  "Gambit",
  "Gamin",
  "Gandolf",
  "Ganette",
  "Garnet",
  "Gator",
  "Gatsby",
  "Gaucho",
  "Gayle",
  "Gazelle",
  "Gem",
  "Gemini",
  "Gemma",
  "Genie",
  "Geno",
  "Gent",
  "Geoffrey",
  "George",
  "Geronimo",
  "Ghabriella",
  "Ghost",
  "Gilly",
  "Gilthanas",
  "Gina",
  "Ginelle",
  "Ginger",
  "Gino",
  "Gizmo",
  "Golactic",
  "Goldie",
  "Goldmoon",
  "Goliath",
  "Golly",
  "Gomer",
  "Gonzo",
  "Gorgeous",
  "Gothard",
  "Grace",
  "Graceland",
  "Gracie",
  "Gringo",
  "Gulliver",
  "Gumby",
  "Gunner",
  "Gus",
  "Gusto",
  "Gusty",
  "Gypsy",
  "Haiku",
  "Hailey",
  "Hal",
  "Haley",
  "Hall",
  "Hally",
  "Hamilton",
  "Hamlet",
  "Happenstance",
  "Happy",
  "Harley",
  "Harmony",
  "Harold",
  "Harrison",
  "Harvey",
  "Hasty",
  "Haughty",
  "Hawk",
  "Hawken",
  "Hawkins",
  "Hazel",
  "Heath",
  "Heather",
  "Heckle",
  "Hemlock",
  "Henry",
  "Hera",
  "Herman",
  "Hermionie",
  "Hero",
  "Hershey",
  "Highlander",
  "Highlight",
  "Higness",
  "Hocus",
  "Hogan",
  "Hola",
  "Homer",
  "Hope",
  "Hoshi",
  "Howler",
  "Huckleberry",
  "Huey",
  "Hugo",
  "Hum",
  "Humphrey",
  "Hunter",
  "Hussy",
  "Hustle",
  "Hutch",
  "Iben",
  "Ibn",
  "Icabob",
  "Icarus",
  "IceDrop",
  "Icecube",
  "Icefall",
  "Ichabod",
  "Ike",
  "Ilio",
  "Illiad",
  "Illusion",
  "Ilona",
  "Image",
  "Imagine",
  "Imogen",
  "Imogene",
  "Inca",
  "Indigo",
  "Indy",
  "Inferno",
  "Inka",
  "Inky",
  "Innocence",
  "Intrigue",
  "Iola",
  "Iolanthe",
  "Irish",
  "Iron",
  "Isaac",
  "Ishan",
  "Ishtar",
  "Isis",
  "Isolde",
  "Ivory",
  "Ivy",
  "Izzi",
  "Izzie",
  "Izzy",
  "Jack",
  "Jackie",
  "Jackpot",
  "Jacky",
  "Jacob",
  "Jade",
  "Jag",
  "James",
  "Jammer",
  "Jamocha",
  "Jana",
  "Jasmine",
  "Jason",
  "Jasper",
  "Java",
  "Javen",
  "Jazz",
  "Jazzy",
  "Jenny",
  "Jesse",
  "Jessica",
  "Jessie",
  "Jester",
  "Jet",
  "Jetter",
  "Jettie",
  "Jewel",
  "Jewell",
  "JigSaw",
  "Jigga",
  "Jigger",
  "Jigsy",
  "Jill",
  "Jillian",
  "Jimmy",
  "Jingles",
  "Jingo",
  "Jinx",
  "Jitters",
  "Jo",
  "Jodami",
  "Jodi",
  "Jody",
  "Joker",
  "Jolie",
  "Jonas",
  "Jonathan",
  "Josef",
  "Josephine",
  "Joy",
  "Joye",
  "Joyride",
  "Judd",
  "Jules",
  "Julie",
  "Juliet",
  "Jumbo",
  "Jumper",
  "Jumpstart",
  "June",
  "Junior",
  "Juniper",
  "Juno",
  "Jupiter",
  "Justice",
  "Kachina",
  "Kacie",
  "Kagney",
  "Kahli",
  "Kahlua",
  "Kahuna",
  "Kaine",
  "Kalahari",
  "Kalika",
  "Kalina",
  "Kalita",
  "Kalli",
  "Kalondra",
  "Kalua",
  "Kalypso",
  "Kara",
  "Karana",
  "Karisha",
  "Karma",
  "Kashmire",
  "Kasimira",
  "Kasmir",
  "Katareena",
  "Katelynn",
  "Katie",
  "Katifa",
  "Kay",
  "Kaye",
  "Kayla",
  "Kaylab",
  "Kayleigh",
  "Keela",
  "Keeta",
  "Kei",
  "Keldoron",
  "Kellendria",
  "Kelpie",
  "Kelty",
  "Kelvin",
  "Kenda",
  "Keno",
  "Kenshi",
  "Kestral",
  "Kevah",
  "Kez",
  "Khan",
  "Kiawa",
  "Killian",
  "King",
  "Kingston",
  "Kip",
  "Kipper",
  "Kira",
  "Kisha",
  "Kismet",
  "Kiss",
  "Kisses",
  "Kitana",
  "Kix",
  "Kizi",
  "Kizmit",
  "Kizzy",
  "Knight",
  "Kodiak",
  "Kodie",
  "Koko",
  "Kotege",
  "Kramer",
  "Kravitz",
  "Krest",
  "Kricket",
  "Kroner",
  "Krystal",
  "Kylie",
  "Kystie",
  "Lace",
  "Lacey",
  "Lacy",
  "Lad",
  "Ladd",
  "Ladigo",
  "Lana",
  "Lanai",
  "Lancelot",
  "Landslide",
  "Lardeo",
  "Lashka",
  "Lass",
  "Latara",
  "Laurel",
  "Lavender",
  "Layla",
  "Ledger",
  "Legacy",
  "Legend",
  "Lena",
  "Leo",
  "Leon",
  "Leonardo",
  "Lesley",
  "Lestat",
  "Level",
  "Levi",
  "Lex",
  "Lexi",
  "Lextus",
  "Lexus",
  "Liberty",
  "Licorice",
  "Liferoot",
  "Light",
  "Lightening",
  "Lightning",
  "Lightning Blossom",
  "Lightning Feet",
  "Lightning Ranger",
  "Lightning Sparkle",
  "Lightning Sparks",
  "Lightning Stallion",
  "Lightning Step",
  "Lightningbolt",
  "Lightningfeet",
  "Lightningfire",
  "Lightningflame",
  "Lightningflash",
  "Lightningheart",
  "Lightninglight",
  "Lightningmane",
  "Lightningsilver",
  "Lilbit",
  "Lillie",
  "Lilly",
  "Lily",
  "Limelight",
  "Lincoln",
  "Linda",
  "Lindsay",
  "Linus",
  "Lio",
  "Logan",
  "Logo",
  "Lorenzo",
  "Lothario",
  "Lotus",
  "Lucifer",
  "Luck Stars",
  "Lucky",
  "Lucus",
  "Lucy",
  "Ludwig",
  "Lugano",
  "Luna",
  "Lunar",
  "Lurch",
  "Mac",
  "Mackenzie",
  "Macleod",
  "Macy",
  "Maddie",
  "Maddison",
  "Maddy",
  "Madison",
  "Maestro",
  "Magavin",
  "Magee",
  "Magic",
  "Magnolia",
  "Magnum",
  "Magoo",
  "Maiden",
  "Maiko",
  "Maisie",
  "Malachite",
  "Malcolm",
  "Malibu",
  "Malifasint",
  "Malikhi",
  "Manchego",
  "Mandolin",
  "Mandy",
  "Mania",
  "Mankala",
  "Manolito",
  "Marama",
  "Maranda",
  "Marbach",
  "Marcie",
  "Marcus",
  "Marengo",
  "Margo",
  "Maria",
  "Marigold",
  "Marion",
  "Marisa",
  "Marlett",
  "Marley",
  "Masquerade",
  "Matica",
  "Matilda",
  "Mattimeo",
  "Maude",
  "Mauharina",
  "Maverick",
  "Max",
  "Maximotion",
  "Maxine",
  "Maxwell",
  "May",
  "Maze",
  "Mazey",
  "McKenna",
  "Medley",
  "Meeka",
  "Megan",
  "Melissa",
  "Mellie",
  "Melody",
  "Memory",
  "Mercedes",
  "Mercury",
  "Mercy",
  "Merietta",
  "Merlin",
  "Merrick",
  "Merrie",
  "Mia",
  "Mica",
  "Midge",
  "Midnight",
  "Midnight Blossom",
  "Midnight Feet",
  "Midnight Ranger",
  "Midnight Sparkle",
  "Midnight Sparks",
  "Midnight Stallion",
  "Midnight Step",
  "Midnightbolt",
  "Midnightfeet",
  "Midnightfire",
  "Midnightflame",
  "Midnightflash",
  "Midnightheart",
  "Midnightlight",
  "Midnightmane",
  "Midnightmare",
  "Midnightsilver",
  "Mika",
  "Milan",
  "Miles",
  "Milley",
  "Millie",
  "Milly",
  "Milo",
  "Mindy",
  "Minx",
  "Miracle",
  "Mirage",
  "Mirren",
  "Mischief",
  "Mission",
  "Mistery",
  "Mistic",
  "Mistico",
  "Mistral",
  "Mistress",
  "Mistro",
  "Misty",
  "Mo",
  "Mocha",
  "Mohawk",
  "Molina",
  "Mollie",
  "Molly",
  "Molson",
  "Momentum",
  "Montana",
  "Montego",
  "Monty",
  "Moon",
  "Moon Blossom",
  "Moon Feet",
  "Moon Ranger",
  "Moon Sparkle",
  "Moon Sparks",
  "Moon Stallion",
  "Moon Step",
  "Moonay",
  "Moonbeam",
  "Moonbolt",
  "Moondancer",
  "Moonfeet",
  "Moonfire",
  "Moonflame",
  "Moonflash",
  "Moonglow",
  "Moonheart",
  "Moonlight",
  "Moonmane",
  "Moonshadow",
  "Moonshine",
  "Moonsilver",
  "Moonwind",
  "Morgause",
  "Moriah",
  "Morning Blossom",
  "Morning Feet",
  "Morning Ranger",
  "Morning Sparkle",
  "Morning Sparks",
  "Morning Stallion",
  "Morning Step",
  "Morningbolt",
  "Morningfeet",
  "Morningfire",
  "Morningflame",
  "Morningflash",
  "Morningheart",
  "Morninglight",
  "Morningmane",
  "Morningsilver",
  "Muchi",
  "Mudslide",
  "Mugsy",
  "Mulder",
  "Mungo",
  "Murphy",
  "Muscade",
  "Mustang",
  "Mysterious",
  "Mystery",
  "Mystic",
  "Mystical",
  "Mystique",
  "Mystro",
  "Mysty",
  "Nabisco",
  "Nabrina",
  "Nadia",
  "Nakima",
  "Nanook",
  "Narita",
  "Narnia",
  "Nash",
  "Natalie",
  "Natasha",
  "Natiqua",
  "Navaho",
  "Navajo",
  "Navar",
  "Navigator",
  "Nellie",
  "Nelly",
  "Nelson",
  "Nemo",
  "Neon",
  "Neptune",
  "Neriffe",
  "Nero",
  "Nevarra",
  "Niagara",
  "Nibbles",
  "Nibbley",
  "Nicole",
  "Nifty",
  "Night Blossom",
  "Night Feet",
  "Night Ranger",
  "Night Sparkle",
  "Night Sparks",
  "Night Stallion",
  "Night Step",
  "Nightbolt",
  "Nightfeet",
  "Nightfire",
  "Nightflame",
  "Nightflash",
  "Nightheart",
  "Nightlight",
  "Nightlite",
  "Nightmane",
  "Nightmare",
  "Nightsilver",
  "Nightstorm",
  "Nikita",
  "Nilly",
  "Nimaway",
  "Nimbus",
  "Noble",
  "Noble Blossom",
  "Noble Feet",
  "Noble Ranger",
  "Noble Sparkle",
  "Noble Sparks",
  "Noble Stallion",
  "Noble Step",
  "Noblebolt",
  "Noblefeet",
  "Noblefire",
  "Nobleflame",
  "Nobleflash",
  "Nobleheart",
  "Noblelight",
  "Noblemane",
  "Noblesilver",
  "Noel",
  "Nor",
  "Norton",
  "Nosey",
  "Nuala",
  "Nugget",
  "Oak",
  "Oasis",
  "Oberon",
  "Oblivion",
  "Obsidian",
  "Ocean",
  "Ocean Breeze",
  "Oddball",
  "Odin",
  "Odyssy",
  "Old Blue",
  "Old Blue Soldier",
  "Oliver",
  "Olivia",
  "Ollie",
  "Olympus",
  "Onix",
  "Onyx",
  "Opal",
  "Orchid",
  "Oreo",
  "Oreon",
  "Orio",
  "Orion",
  "Othello",
  "Outlaw",
  "Pacheco",
  "Pacific",
  "Pacos",
  "Paddington",
  "Paddy",
  "Pagong",
  "Paint",
  "Paladen",
  "Paladin",
  "Paladine",
  "Pandemonium",
  "Pandora",
  "Panosh",
  "Pansy",
  "Parable",
  "Parker",
  "Partner",
  "Passion",
  "Patch",
  "Patches",
  "Patience",
  "Patra",
  "Patriot",
  "Peach",
  "Peaches",
  "Peak",
  "Peanut",
  "Pearl",
  "Pebbles",
  "Pegasus",
  "Pegretta",
  "Pendragon",
  "Penelope",
  "Penny",
  "Pepper",
  "Peppercorn",
  "Peppermint",
  "Percy",
  "Pericles",
  "Peridot",
  "Perseus",
  "Petal",
  "Petzi",
  "Peyton",
  "Phantagero",
  "Phantasia",
  "Phantom",
  "Phenomenon",
  "Phoenix",
  "Picket",
  "Pilgrim",
  "Pippa",
  "Pittsburgh",
  "Pixie",
  "Pizazz",
  "Pleasures",
  "Plunket",
  "Pluto",
  "Pocaroo",
  "Pockets",
  "Poco",
  "Pokey",
  "Pontiac",
  "Porthos",
  "Portia",
  "Porto",
  "Powder",
  "Prancer",
  "Preacher",
  "Precious",
  "Prelizee",
  "Pride",
  "Prince",
  "Princess",
  "Prissy",
  "Prixie",
  "Promise",
  "Prudince",
  "Prymos",
  "Punch",
  "Pure",
  "Puzzle",
  "Puzzles",
  "Quail",
  "Quantum",
  "Quark",
  "Quazar",
  "Queen",
  "Quentin",
  "Quest",
  "Quick Blossom",
  "Quick Feet",
  "Quick Ranger",
  "Quick Sparkle",
  "Quick Sparks",
  "Quick Stallion",
  "Quick Step",
  "Quickbolt",
  "Quickfeet",
  "Quickfire",
  "Quickflame",
  "Quickflash",
  "Quickheart",
  "Quicklight",
  "Quickmane",
  "Quicksilver",
  "Quickstep",
  "Quimby",
  "Quimico",
  "Quincy",
  "Quinn",
  "Quinton",
  "Quiver",
  "Racer",
  "Rachel",
  "Raffle",
  "Rage",
  "Rageous",
  "Rags",
  "Rain",
  "Rain Blossom",
  "Rain Feet",
  "Rain Ranger",
  "Rain Sparkle",
  "Rain Sparks",
  "Rain Stallion",
  "Rain Step",
  "Rainbolt",
  "Rainbow",
  "Raindancer",
  "Raindrop",
  "Raine",
  "Rainfeet",
  "Rainfire",
  "Rainflame",
  "Rainflash",
  "Rainheart",
  "Rainlight",
  "Rainmane",
  "Rainsilver",
  "Rainstone",
  "Rainstorm",
  "Ramses",
  "Ramsis",
  "Ranger",
  "Raphael",
  "Rapid Blossom",
  "Rapid Feet",
  "Rapid Ranger",
  "Rapid Sparkle",
  "Rapid Sparks",
  "Rapid Stallion",
  "Rapid Step",
  "Rapidbolt",
  "Rapidfeet",
  "Rapidfire",
  "Rapidflame",
  "Rapidflash",
  "Rapidheart",
  "Rapidlight",
  "Rapidmane",
  "Rapidsilver",
  "Rascal",
  "Raven",
  "Rebel",
  "Reckless",
  "Red",
  "Red Baron",
  "Red Devil",
  "Red Eagle",
  "Red Fire",
  "Reflection",
  "Reflexion",
  "Reginald",
  "Regis",
  "Remington",
  "Remrock",
  "Renassiance",
  "Renegade",
  "Reno",
  "Resolution",
  "Restless",
  "Revolutionary",
  "Rex",
  "Rhambles",
  "Ridley",
  "Riley",
  "Ring",
  "Ringo",
  "Ripples",
  "Robin",
  "Rodeo",
  "Rogue",
  "Romeo",
  "Romper",
  "Rona",
  "Roofus",
  "Roscoe",
  "Rose",
  "Roseburg",
  "Rosemarie",
  "Rosey",
  "Rosie",
  "Roswel",
  "Rouge",
  "Roulette",
  "Rowdy",
  "Roxy",
  "Royal",
  "Ruby",
  "Rumble",
  "Rupert",
  "Rusty",
  "Rynstone",
  "Sable",
  "Sabre",
  "Sabrina",
  "Saddler",
  "Saffron",
  "Sage",
  "Sagen",
  "Sahara",
  "Sako",
  "Salem",
  "Sally",
  "Salsa",
  "Samara",
  "Sambuca",
  "Sammie",
  "Sammy",
  "Sampson",
  "Sancho",
  "Sandshine",
  "Sandy",
  "Santana",
  "Santos",
  "Sapphire",
  "Sarah",
  "Sargent",
  "Sateen",
  "Satin",
  "Satine",
  "Saviour",
  "Saxson",
  "Scarlet",
  "Scarlett",
  "Scarlette",
  "Score",
  "Scout",
  "Scratch",
  "Scribbles",
  "Seamus",
  "Sebulba",
  "Secoya",
  "Secret",
  "Selcier",
  "Selena",
  "Seneka",
  "Senna",
  "Senshi",
  "Serendipity",
  "Serenity",
  "Seth",
  "Sevana",
  "Sevaritza",
  "Seyton",
  "Shabas",
  "Shade",
  "Shade Blossom",
  "Shade Feet",
  "Shade Ranger",
  "Shade Sparkle",
  "Shade Sparks",
  "Shade Stallion",
  "Shade Step",
  "Shadebolt",
  "Shadefeet",
  "Shadefire",
  "Shadeflame",
  "Shadeflash",
  "Shadeheart",
  "Shadelight",
  "Shademane",
  "Shades",
  "Shadesilver",
  "Shadow",
  "Shadow Blossom",
  "Shadow Feet",
  "Shadow Ranger",
  "Shadow Sparkle",
  "Shadow Sparks",
  "Shadow Stallion",
  "Shadow Step",
  "Shadowbolt",
  "Shadowfax",
  "Shadowfeet",
  "Shadowfire",
  "Shadowflame",
  "Shadowflash",
  "Shadowheart",
  "Shadowlight",
  "Shadowmane",
  "Shadows",
  "Shadowsilver",
  "Shady",
  "Shae",
  "Shah",
  "Shakan",
  "Shamara",
  "Shamin",
  "Shamrock",
  "Shamus",
  "Shandy",
  "Shane",
  "Shanita",
  "Shannon",
  "Shanty",
  "Sharpie",
  "Shasta",
  "Shawnee",
  "Shaylan",
  "Sheba",
  "Shebe",
  "Sheeva",
  "Shelby",
  "Shera",
  "Sherbet",
  "Shergar",
  "Sherman",
  "Sherreef",
  "Sherri",
  "Sherrif",
  "Sherwin",
  "Sheyanne",
  "Sheza",
  "Shianne",
  "Shilo",
  "Shiloh",
  "Shimmer",
  "Shining",
  "Shirley",
  "Shiver",
  "Shocker",
  "Showdown",
  "Shy",
  "Shyanne",
  "Sid",
  "Sidney",
  "Sierra",
  "Silence",
  "Silhouette",
  "Silk",
  "Silky",
  "Silvara",
  "Silver",
  "Silverwood",
  "Sioux",
  "Sirius",
  "Siroco",
  "Sisco",
  "Sizzler",
  "Skippa",
  "Skipper",
  "Sky",
  "Sky Blossom",
  "Sky Feet",
  "Sky Ranger",
  "Sky Sparkle",
  "Sky Sparks",
  "Sky Stallion",
  "Sky Step",
  "Skybolt",
  "Skyborne",
  "Skybound",
  "Skydance",
  "Skydancer",
  "Skye",
  "Skyfeet",
  "Skyfire",
  "Skyflame",
  "Skyflash",
  "Skyheart",
  "Skyla",
  "Skylark",
  "Skyler",
  "Skylight",
  "Skymane",
  "Skysilver",
  "Skysong",
  "Slate",
  "Slick",
  "Sling",
  "Sly",
  "Smokey",
  "Snake",
  "Snapdragon",
  "Snickers",
  "Snip",
  "Sniper",
  "Snipper",
  "Snow",
  "Snow Blossom",
  "Snow Feet",
  "Snow Ranger",
  "Snow Sparkle",
  "Snow Sparks",
  "Snow Stallion",
  "Snow Step",
  "Snowball",
  "Snowbolt",
  "Snowey",
  "Snowfeet",
  "Snowfire",
  "Snowflake",
  "Snowflame",
  "Snowflash",
  "Snowheart",
  "Snowhite",
  "Snowlight",
  "Snowmane",
  "Snowsilver",
  "Snowy",
  "Socks",
  "Soho",
  "Solar",
  "Solaris",
  "Soleil",
  "Solmyr",
  "Solomon",
  "Sommer",
  "Song",
  "Song of Songs",
  "Sparkey",
  "Sparkle Blossom",
  "Sparkle Feet",
  "Sparkle Ranger",
  "Sparkle Sparkle",
  "Sparkle Sparks",
  "Sparkle Stallion",
  "Sparkle Step",
  "Sparklebolt",
  "Sparklefeet",
  "Sparklefire",
  "Sparkleflame",
  "Sparkleflash",
  "Sparkleheart",
  "Sparklelight",
  "Sparklemane",
  "Sparkler",
  "Sparklesilver",
  "Speckles",
  "Spencer",
  "Spice",
  "Spike",
  "Spinner",
  "Spirit",
  "Spitfire",
  "Spot",
  "Sprite",
  "Sprocket",
  "Stallion",
  "Star",
  "Star Blossom",
  "Star Feet",
  "Star Ranger",
  "Star Sparkle",
  "Star Sparks",
  "Star Stallion",
  "Star Step",
  "Starbolt",
  "Starbright",
  "Starbuck",
  "Starburst",
  "Stardust",
  "Starduster",
  "Starfeet",
  "Starfire",
  "Starflame",
  "Starflash",
  "Stargazer",
  "Starheart",
  "Starlett",
  "Starlight",
  "Starling",
  "Starlit",
  "Starman",
  "Starmane",
  "Starr",
  "Starshine",
  "Starsilver",
  "Starsky",
  "Starstruck",
  "Startrail",
  "Steamer",
  "Stella",
  "Stellar",
  "Sterling",
  "Storm",
  "Storm Blossom",
  "Storm Feet",
  "Storm Ranger",
  "Storm Sparkle",
  "Storm Sparks",
  "Storm Stallion",
  "Storm Step",
  "Stormbolt",
  "Stormfeet",
  "Stormfire",
  "Stormflame",
  "Stormflash",
  "Stormheart",
  "Stormlight",
  "Stormmane",
  "Stormsilver",
  "Stormy Weather",
  "Strider",
  "Stripe",
  "Stryker",
  "Sugar",
  "Sugar Blossom",
  "Sugar Feet",
  "Sugar Ranger",
  "Sugar Sparkle",
  "Sugar Sparks",
  "Sugar Stallion",
  "Sugar Step",
  "Sugarbolt",
  "Sugarfeet",
  "Sugarfire",
  "Sugarflame",
  "Sugarflash",
  "Sugarheart",
  "Sugarlight",
  "Sugarmane",
  "Sugarsilver",
  "Sukura",
  "Sullivan",
  "Sully",
  "Summer Breeze",
  "Summer Eclipse",
  "Summit",
  "Summoner",
  "Sun Blossom",
  "Sun Feet",
  "Sun Ranger",
  "Sun Sparkle",
  "Sun Sparks",
  "Sun Stallion",
  "Sun Step",
  "Sunbolt",
  "Sunchaser",
  "Sundance",
  "Sundancer",
  "Sundrop",
  "Sunfeet",
  "Sunfire",
  "Sunflame",
  "Sunflash",
  "Sunheart",
  "Sunlight",
  "Sunmane",
  "Sunrise",
  "Sunshine",
  "Sunsilver",
  "Supreme",
  "Sweet Blossom",
  "Sweet Breeze",
  "Sweet Dreams",
  "Sweet Feet",
  "Sweet Ranger",
  "Sweet Sparkle",
  "Sweet Sparks",
  "Sweet Stallion",
  "Sweet Step",
  "Sweetbolt",
  "Sweetfeet",
  "Sweetfire",
  "Sweetflame",
  "Sweetflash",
  "Sweetheart",
  "Sweetlight",
  "Sweetmane",
  "Sweetsilver",
  "Swift Blossom",
  "Swift Feet",
  "Swift Ranger",
  "Swift Sparkle",
  "Swift Sparks",
  "Swift Stallion",
  "Swift Step",
  "Swiftbolt",
  "Swiftfeet",
  "Swiftfire",
  "Swiftflame",
  "Swiftflash",
  "Swiftheart",
  "Swiftlight",
  "Swiftmane",
  "Swiftsilver",
  "Swirl",
  "Sydney",
  "Sylvester",
  "Symphony",
  "Tallyesson",
  "Talyn",
  "Talzanna",
  "Tamara",
  "Tambourine",
  "Tami",
  "Tamika",
  "Tammy",
  "Tang",
  "Tango",
  "Tanis",
  "Tanna",
  "Tanner",
  "Tantor",
  "Tara",
  "Taragon",
  "Tash",
  "Tasha",
  "Tater",
  "Taydee",
  "Taylor",
  "Taz",
  "Tease",
  "Teasle",
  "Temper",
  "Tempest",
  "Tempo",
  "Temptress",
  "Tender",
  "Tex",
  "Thade",
  "Theo",
  "Theodorable",
  "Thor",
  "Thowra",
  "Thuderstorm",
  "Thumper",
  "Thunder",
  "Thunder Blossom",
  "Thunder Feet",
  "Thunder Ranger",
  "Thunder Sparkle",
  "Thunder Sparks",
  "Thunder Stallion",
  "Thunder Step",
  "Thunder-feet",
  "Thunderbird",
  "Thunderbolt",
  "Thunderfeet",
  "Thunderfire",
  "Thunderflame",
  "Thunderflash",
  "Thunderheart",
  "Thunderlight",
  "Thundermane",
  "Thundersilver",
  "Tido",
  "Tigger",
  "Tigre",
  "Tilly",
  "Timber",
  "Titan",
  "Titus",
  "Tobasco",
  "Tobiana",
  "Tocker",
  "Tooter",
  "Topanga",
  "Topanna",
  "Topaz",
  "Torch",
  "Tori",
  "Toric",
  "Torigon",
  "Tornado",
  "Trace",
  "Tracer",
  "Tracker",
  "Tramp",
  "Trapper",
  "Travaldo",
  "Trax",
  "Treacle",
  "Treasure",
  "Tribute",
  "Tricks",
  "Trigger",
  "Trigger Blossom",
  "Trigger Feet",
  "Trigger Ranger",
  "Trigger Sparkle",
  "Trigger Sparks",
  "Trigger Stallion",
  "Trigger Step",
  "Triggerbolt",
  "Triggerfeet",
  "Triggerfire",
  "Triggerflame",
  "Triggerflash",
  "Triggerheart",
  "Triggerlight",
  "Triggermane",
  "Triggersilver",
  "Trinity",
  "Triples",
  "Tripp",
  "Tristan",
  "Triton",
  "Trixie",
  "Trojan",
  "Tronto",
  "Trooper",
  "Troubles",
  "Tux",
  "Twain",
  "Twiggs",
  "Twilight",
  "Twinkle Toes",
  "Twister",
  "Ty",
  "Tyra",
  "Tyson",
  "Ula",
  "Ulyses",
  "Ulysses",
  "Unagi",
  "Uniquess",
  "Unity",
  "Urko",
  "Ursa",
  "Utara",
  "Uther",
  "Utopia",
  "Vagabond",
  "Val",
  "Valentine",
  "Valley",
  "Vandy",
  "Vanilla",
  "Vanity",
  "Varsity",
  "Vassili",
  "Vebula",
  "Vedette",
  "Vegas",
  "Velocity",
  "Velvet",
  "Venture",
  "Venus",
  "Verdun",
  "Verona",
  "Verse",
  "Victor",
  "Victory",
  "Violence",
  "Vixen",
  "Vogue",
  "Volano",
  "Voyager",
  "Wakita",
  "Waldo",
  "Walker",
  "Wallflower",
  "Warrior",
  "Watson",
  "Waylan",
  "Webster",
  "Wench",
  "Wesley",
  "Wexford",
  "Whiskey",
  "Whisper",
  "Whitley",
  "Wiard",
  "Wilbur",
  "Wild Blossom",
  "Wild Feet",
  "Wild Ranger",
  "Wild Sparkle",
  "Wild Sparks",
  "Wild Stallion",
  "Wild Step",
  "Wildbolt",
  "Wildcat",
  "Wildfeet",
  "Wildfire",
  "Wildflame",
  "Wildflash",
  "Wildheart",
  "Wildlight",
  "Wildmane",
  "Wildsilver",
  "Wildwind",
  "Wiley",
  "William",
  "Willow",
  "Wind Breaker",
  "Wind Chaser",
  "Wind Dancer",
  "Wind Maker",
  "Wind Runner",
  "Wind Song",
  "Windago",
  "Windjammer",
  "Windrunner",
  "Windsong",
  "Windstorm",
  "Wings",
  "Wings of an Angel",
  "Wingstar",
  "Winslow",
  "Winsome",
  "Winston",
  "Wolf",
  "Womble",
  "Wonder",
  "Woodstock",
  "Wrangler",
  "Wriggley",
  "Xanadu",
  "Xantoxu",
  "Xaohroa",
  "Xavior",
  "Xena",
  "Xenia",
  "Xerox",
  "Xerxes",
  "Xiao",
  "Xylon",
  "Xylos",
  "Yago",
  "Yentel",
  "Yoko",
  "Yorik",
  "Yosemite",
  "Yuki",
  "Yukon",
  "Zace",
  "Zaide",
  "Zalika",
  "Zane",
  "Zani",
  "Zara",
  "Zaracha",
  "Zen",
  "Zena",
  "Zenith",
  "Zenon",
  "Zepher",
  "Zephyr",
  "Zeqoia",
  "Zeus",
  "Ziggy",
  "Zimbro",
  "Zinc",
  "Zip",
  "Zylan",
];

export class HorseNameGenerator{

  static getHorseName() {
    let index = (Math.random() * _horseNames.length) | 0;
    let answer = _horseNames[index];
    _horseNames.splice(index, 1);
    return answer;
  };

}
export class RaceHorse {

  NAME : string;
  _owner: any;
  animIndexer: number
  HORSE_TYPE;
  SPEED_FACTOR: number;
  ENERGY_FALL_DISTANCE: number;
  SLOWER_SPEED_FACTOR : number;
  GOING_TYPE: number;

  constructor (horseName) {
    this.NAME = horseName;
    this._owner = null;
    this.animIndexer = 0;
    const horseType = (Math.random() * 3) | 0;
    this.HORSE_TYPE = horseType;
    this.SPEED_FACTOR = 0;
    this.GOING_TYPE = 1;
    switch (this.HORSE_TYPE) {
      case HORSETYPES.SHORT_RACE:
        // energy falls after 3 - 6 furlongs
        this.ENERGY_FALL_DISTANCE =
          ((3 + Math.random() * 3) | 0) * PIXELS_PER_FURLONG;
        this.SPEED_FACTOR = 1.2 + this.SPEED_FACTOR + Math.random() / 5;
        this.SLOWER_SPEED_FACTOR = this.SPEED_FACTOR * 0.5 + Math.random() / 10;
        break;
      case HORSETYPES.MEDIUM_RACE:
        // energy fails are 5-15 furlongs
        this.ENERGY_FALL_DISTANCE =
          ((5 + Math.random() * 10) | 0) * PIXELS_PER_FURLONG;
        this.SPEED_FACTOR = 1 + this.SPEED_FACTOR + Math.random() / 4;
        this.SLOWER_SPEED_FACTOR = this.SPEED_FACTOR * 0.6 + Math.random() / 10;
        break;
      case HORSETYPES.LONG_RACE:
        // energy fails are 12+ furlongs
        this.ENERGY_FALL_DISTANCE =
          ((12 + Math.random() * 10) | 0) * PIXELS_PER_FURLONG;
        this.SPEED_FACTOR = 0.9 + this.SPEED_FACTOR + Math.random() / 10;
        this.SLOWER_SPEED_FACTOR = this.SPEED_FACTOR * 0.7 + Math.random() / 10;
        break;
      default:
        break;
    }
  }
}
