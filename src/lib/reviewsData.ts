export interface ProductReviewItem {
  id: string;
  productId: string;
  customerName: string;
  customerRole: string;
  location?: string;
  rating: number;
  comment: string;
  placedAt: number;
  verified: boolean;
  featured: boolean;
  helpfulCount: number;
}

// Helper to generate timestamps within recent months
const daysAgo = (days: number) => Date.now() - days * 24 * 60 * 60 * 1000;

export const defaultReviews: ProductReviewItem[] = [
  // -------------------------------------------------------------
  // prod-01: Abstract Horizon
  // -------------------------------------------------------------
  {
    id: 'rev-p01-01',
    productId: 'prod-01',
    customerName: 'Marcus Van Houten',
    customerRole: 'Principal Architect, Studio Antwerp',
    location: 'Antwerp, Belgium',
    rating: 5,
    comment: 'The laser-straight gold hairline against the layered warm cream impasto creates unprecedented architectural depth. Floating on 20mm standoffs in our client reception, the shadow line responds dynamically to morning light.',
    placedAt: daysAgo(12),
    verified: true,
    featured: true,
    helpfulCount: 38
  },
  {
    id: 'rev-p01-02',
    productId: 'prod-01',
    customerName: 'Elena Rostova',
    customerRole: 'Private Art Collector',
    location: 'Zurich, Switzerland',
    rating: 5,
    comment: 'Museum-grade timber crate packaging. The natural oak float frame has seamless 45-degree mitered corners, and the subtle maroon pigments ground our neutral salon interior with supreme warmth.',
    placedAt: daysAgo(26),
    verified: true,
    featured: true,
    helpfulCount: 29
  },
  {
    id: 'rev-p01-03',
    productId: 'prod-01',
    customerName: 'Jean-Luc Moreau',
    customerRole: 'Design Director, Atelier Marais',
    location: 'Paris, France',
    rating: 5,
    comment: 'We specified the 180x100cm Grand edition for a Haussmannian penthouse. The 24K gold line reflects evening candlelight with extraordinary discretion.',
    placedAt: daysAgo(39),
    verified: true,
    featured: true,
    helpfulCount: 24
  },
  {
    id: 'rev-p01-04',
    productId: 'prod-01',
    customerName: 'Sarah Jenkins',
    customerRole: 'Residential Interior Designer',
    location: 'London, UK',
    rating: 5,
    comment: 'The tactile texture is even more striking in person than in the gallery imagery. Sturdy concealed French cleat hardware made wall installation effortless.',
    placedAt: daysAgo(54),
    verified: true,
    featured: false,
    helpfulCount: 16
  },
  {
    id: 'rev-p01-05',
    productId: 'prod-01',
    customerName: 'Dr. Henrik Lindqvist',
    customerRole: 'Architectural Historian',
    location: 'Stockholm, Sweden',
    rating: 5,
    comment: 'Exquisite balance of texture and silence. Vernox captured a timeless horizon without cliché. Arrived fully authenticated with signed workshop seal.',
    placedAt: daysAgo(71),
    verified: true,
    featured: false,
    helpfulCount: 19
  },
  {
    id: 'rev-p01-06',
    productId: 'prod-01',
    customerName: 'Clara Delacroix',
    customerRole: 'Senior Partner, Delacroix Design',
    location: 'Geneva, Switzerland',
    rating: 4,
    comment: 'Substantial canvas weight and beautiful hand-applied gold leaf. Delivery took 5 days rather than 3 due to customs clearance, but customer concierge kept us updated daily.',
    placedAt: daysAgo(88),
    verified: true,
    featured: false,
    helpfulCount: 11
  },
  {
    id: 'rev-p01-07',
    productId: 'prod-01',
    customerName: 'David K. Vance',
    customerRole: 'Private Patron',
    location: 'New York, USA',
    rating: 5,
    comment: 'Placed above our dining console. The conversation piece of every dinner party. The delicate gold hairline glows under dim wall sconces.',
    placedAt: daysAgo(104),
    verified: true,
    featured: false,
    helpfulCount: 14
  },
  {
    id: 'rev-p01-08',
    productId: 'prod-01',
    customerName: 'Yuki Takahashi',
    customerRole: 'Hospitality Stylist',
    location: 'Kyoto, Japan',
    rating: 5,
    comment: 'Its restraint honors the aesthetics of wabi-sabi while maintaining modern European precision. Our boutique hotel guests consistently inquire about the artist.',
    placedAt: daysAgo(120),
    verified: true,
    featured: false,
    helpfulCount: 22
  },
  {
    id: 'rev-p01-09',
    productId: 'prod-01',
    customerName: 'Matteo Bernardi',
    customerRole: 'Architect & Urbanist',
    location: 'Milan, Italy',
    rating: 5,
    comment: 'The oak float frame tolerances are within half a millimeter. You can genuinely feel the metallurgical discipline Vernox applies across their entire catalog.',
    placedAt: daysAgo(142),
    verified: true,
    featured: false,
    helpfulCount: 8
  },
  {
    id: 'rev-p01-10',
    productId: 'prod-01',
    customerName: 'Beatrice Fontaine',
    customerRole: 'Art Consultant',
    location: 'Brussels, Belgium',
    rating: 5,
    comment: 'Third time commissioning an Abstract Horizon for private residential clients. Consistent museum quality every single time.',
    placedAt: daysAgo(165),
    verified: true,
    featured: false,
    helpfulCount: 15
  },

  // -------------------------------------------------------------
  // prod-02: Golden Silence
  // -------------------------------------------------------------
  {
    id: 'rev-p02-01',
    productId: 'prod-02',
    customerName: 'Julian Sterling',
    customerRole: 'Collector & Curator',
    location: 'London, UK',
    rating: 5,
    comment: 'At 8.4 kilograms, the bronze casting has real gravity. The matte gold patina is hand-burnished rather than plated, giving it an ancient yet distinctly modernist presence atop the cream marble plinth.',
    placedAt: daysAgo(8),
    verified: true,
    featured: true,
    helpfulCount: 45
  },
  {
    id: 'rev-p02-02',
    productId: 'prod-02',
    customerName: 'Ingrid Bergman-Soto',
    customerRole: 'Interior Architecture Director',
    location: 'Oslo, Norway',
    rating: 5,
    comment: 'The fluid loop evokes Brancusi and Arp with sovereign contemporary elegance. The marble base has subtle crystalline veining that pairs harmoniously with oak flooring.',
    placedAt: daysAgo(18),
    verified: true,
    featured: true,
    helpfulCount: 31
  },
  {
    id: 'rev-p02-03',
    productId: 'prod-02',
    customerName: 'Gaston Duprès',
    customerRole: 'Founding Partner, Duprès Architecture',
    location: 'Monaco',
    rating: 5,
    comment: 'Placed on a central black granite plinth in an executive penthouse. The way light cascades down the curving bronze spine is pure poetry.',
    placedAt: daysAgo(35),
    verified: true,
    featured: true,
    helpfulCount: 27
  },
  {
    id: 'rev-p02-04',
    productId: 'prod-02',
    customerName: 'Camilla Vasquez',
    customerRole: 'Private Collector',
    location: 'Madrid, Spain',
    rating: 5,
    comment: 'Unboxing experience was breathtaking. Arrived bolted inside custom high-density foam within a reinforced wooden atelier crate with white handling gloves.',
    placedAt: daysAgo(48),
    verified: true,
    featured: false,
    helpfulCount: 18
  },
  {
    id: 'rev-p02-05',
    productId: 'prod-02',
    customerName: 'Robert Langdon',
    customerRole: 'Art Consultant',
    location: 'Boston, USA',
    rating: 5,
    comment: 'Solid bronze noble casting. The brushed satin finish catches indirect ambient light without harsh glare. A masterwork of calm contemplation.',
    placedAt: daysAgo(62),
    verified: true,
    featured: false,
    helpfulCount: 14
  },
  {
    id: 'rev-p02-06',
    productId: 'prod-02',
    customerName: 'Aurelia Becker',
    customerRole: 'Curator, Modernist Salon',
    location: 'Vienna, Austria',
    rating: 5,
    comment: 'The weight distribution between the cast figure and the honed stone plinth is engineered to perfection. Remarkable tactile finish.',
    placedAt: daysAgo(80),
    verified: true,
    featured: false,
    helpfulCount: 12
  },
  {
    id: 'rev-p02-07',
    productId: 'prod-02',
    customerName: 'Michael Thorne',
    customerRole: 'Executive Homeowner',
    location: 'Chicago, USA',
    rating: 4,
    comment: 'Stunning centerpiece on our credenza. Substantial piece. Only caution is to use two hands when lifting due to the weight of the marble base.',
    placedAt: daysAgo(99),
    verified: true,
    featured: false,
    helpfulCount: 9
  },
  {
    id: 'rev-p02-08',
    productId: 'prod-02',
    customerName: 'Valerie Cho',
    customerRole: 'Gallery Director',
    location: 'Singapore',
    rating: 5,
    comment: 'Hand-burnished matte gold patina that will only enrich with age. Vernox sets a standard of metallurgy few contemporary workshops can rival.',
    placedAt: daysAgo(115),
    verified: true,
    featured: false,
    helpfulCount: 16
  },
  {
    id: 'rev-p02-09',
    productId: 'prod-02',
    customerName: 'Klaus Eichel',
    customerRole: 'Architectural Consultant',
    location: 'Berlin, Germany',
    rating: 5,
    comment: 'Purchased for our conference room centerpiece. Communicates silent confidence and refined artistic appreciation.',
    placedAt: daysAgo(138),
    verified: true,
    featured: false,
    helpfulCount: 11
  },
  {
    id: 'rev-p02-10',
    productId: 'prod-02',
    customerName: 'Nathalie Vane',
    customerRole: 'Private Collector',
    location: 'Paris, France',
    rating: 5,
    comment: 'Every guest stops to admire it. The certificate of authenticity was sealed with the Antwerp workshop stamp. Truly a museum piece.',
    placedAt: daysAgo(159),
    verified: true,
    featured: false,
    helpfulCount: 20
  },

  // -------------------------------------------------------------
  // prod-03: Sculptural Form
  // -------------------------------------------------------------
  {
    id: 'rev-p03-01',
    productId: 'prod-03',
    customerName: 'Soren Kjaergaard',
    customerRole: 'Chief Architect, Kjaergaard Studio',
    location: 'Copenhagen, Denmark',
    rating: 5,
    comment: 'The continuous Möbius ribbon loop creates endless silhouettes as you move through the space. The dark umber bronze with antique brass bevel transitions seamlessly into our travertine fireplace mantle.',
    placedAt: daysAgo(15),
    verified: true,
    featured: true,
    helpfulCount: 34
  },
  {
    id: 'rev-p03-02',
    productId: 'prod-03',
    customerName: 'Dominique Cassel',
    customerRole: 'Sculpture Collector',
    location: 'Lyon, France',
    rating: 5,
    comment: 'Solid milled bronze ribbon. The hand-burnished brass edge catches the low late-afternoon sun with incredible brilliance. Highly recommended.',
    placedAt: daysAgo(29),
    verified: true,
    featured: true,
    helpfulCount: 26
  },
  {
    id: 'rev-p03-03',
    productId: 'prod-03',
    customerName: 'Liam O’Connor',
    customerRole: 'Managing Director, Horizon Capital',
    location: 'Dublin, Ireland',
    rating: 5,
    comment: 'We ordered the Monument 65cm edition for our corporate lobby. It commands the room with sculptural authority without overpowering the minimalist architecture.',
    placedAt: daysAgo(42),
    verified: true,
    featured: true,
    helpfulCount: 21
  },
  {
    id: 'rev-p03-04',
    productId: 'prod-03',
    customerName: 'Hiroshi Tanaka',
    customerRole: 'Interior Designer',
    location: 'Tokyo, Japan',
    rating: 5,
    comment: 'The dark bronze patina is uniform and silky to the touch. The ivory travertine plinth anchors the kinetic ribbon loops perfectly.',
    placedAt: daysAgo(59),
    verified: true,
    featured: false,
    helpfulCount: 17
  },
  {
    id: 'rev-p03-05',
    productId: 'prod-03',
    customerName: 'Eleanor Vance',
    customerRole: 'Private Collector',
    location: 'Sydney, Australia',
    rating: 5,
    comment: 'Shipping to Australia arrived in under a week with immaculate timber crate protection. The sculpture is heavy, balanced, and exceptionally crafted.',
    placedAt: daysAgo(77),
    verified: true,
    featured: false,
    helpfulCount: 13
  },
  {
    id: 'rev-p03-06',
    productId: 'prod-03',
    customerName: 'Antoine Delorme',
    customerRole: 'Principal, AD Architecture',
    location: 'Bordeaux, France',
    rating: 4,
    comment: 'Fantastic geometric loop. The brass bevel is hand-polished to perfection. The travertine stone has natural pores which look very authentic.',
    placedAt: daysAgo(93),
    verified: true,
    featured: false,
    helpfulCount: 9
  },
  {
    id: 'rev-p03-07',
    productId: 'prod-03',
    customerName: 'Carla De Luca',
    customerRole: 'Curator',
    location: 'Rome, Italy',
    rating: 5,
    comment: 'Remarkable three-dimensional dynamism. From every perspective it reveals a fresh contour. True metallurgical virtuosity.',
    placedAt: daysAgo(110),
    verified: true,
    featured: false,
    helpfulCount: 15
  },
  {
    id: 'rev-p03-08',
    productId: 'prod-03',
    customerName: 'Graham Shaw',
    customerRole: 'Private Patron',
    location: 'Edinburgh, UK',
    rating: 5,
    comment: 'My favorite piece in my collection. The dark umber patina has rich olive undertones under direct halogen spotlights.',
    placedAt: daysAgo(128),
    verified: true,
    featured: false,
    helpfulCount: 12
  },
  {
    id: 'rev-p03-09',
    productId: 'prod-03',
    customerName: 'Fiona Meyer',
    customerRole: 'Interior Stylist',
    location: 'Hamburg, Germany',
    rating: 5,
    comment: 'Specified for an executive library suite. The client was ecstatic with the weight and hand-finished bevels.',
    placedAt: daysAgo(147),
    verified: true,
    featured: false,
    helpfulCount: 10
  },
  {
    id: 'rev-p03-10',
    productId: 'prod-03',
    customerName: 'Stefan Nygard',
    customerRole: 'Design Consultant',
    location: 'Helsinki, Finland',
    rating: 5,
    comment: 'An astonishing exploration of continuous form. Vernox delivers craftsmanship on par with high-end European foundries.',
    placedAt: daysAgo(172),
    verified: true,
    featured: false,
    helpfulCount: 14
  },

  // -------------------------------------------------------------
  // prod-04: Maroon Geometry
  // -------------------------------------------------------------
  {
    id: 'rev-p04-01',
    productId: 'prod-04',
    customerName: 'Matthias Brandt',
    customerRole: 'Creative Director, Studio Brandt',
    location: 'Munich, Germany',
    rating: 5,
    comment: 'The contrast of deep burgundy #5B262C against natural Belgian linen ground is masterfully dialed. The razor-sharp gold leaf line brings strict architectural order to the room.',
    placedAt: daysAgo(11),
    verified: true,
    featured: true,
    helpfulCount: 28
  },
  {
    id: 'rev-p04-02',
    productId: 'prod-04',
    customerName: 'Genevieve Roux',
    customerRole: 'Private Collector',
    location: 'Marseille, France',
    rating: 5,
    comment: 'The 90x90cm Statement edition hangs above our velvet banquette. The earth terracotta and deep wine tones harmonize impeccably with aged brass lighting.',
    placedAt: daysAgo(24),
    verified: true,
    featured: true,
    helpfulCount: 22
  },
  {
    id: 'rev-p04-03',
    productId: 'prod-04',
    customerName: 'Oliver Sterling',
    customerRole: 'Architectural Consultant',
    location: 'London, UK',
    rating: 5,
    comment: 'Geometric precision with a tactile, human impasto soul. The linen texture peeks through the terracotta washes with sublime subtlety.',
    placedAt: daysAgo(44),
    verified: true,
    featured: false,
    helpfulCount: 17
  },
  {
    id: 'rev-p04-04',
    productId: 'prod-04',
    customerName: 'Alessia Bianchi',
    customerRole: 'Interior Designer',
    location: 'Florence, Italy',
    rating: 5,
    comment: 'The gold line is applied with surgical precision. It catches morning daylight in our minimalist living room and transforms the whole mood.',
    placedAt: daysAgo(61),
    verified: true,
    featured: false,
    helpfulCount: 15
  },
  {
    id: 'rev-p04-05',
    productId: 'prod-04',
    customerName: 'Daniel Hayes',
    customerRole: 'Private Patron',
    location: 'San Francisco, USA',
    rating: 4,
    comment: 'Beautiful Bauhaus-inspired geometry. The frame is minimal and solid oak. Very happy with the acquisition.',
    placedAt: daysAgo(82),
    verified: true,
    featured: false,
    helpfulCount: 8
  },
  {
    id: 'rev-p04-06',
    productId: 'prod-04',
    customerName: 'Chloe Van Der Beek',
    customerRole: 'Curator',
    location: 'Amsterdam, Netherlands',
    rating: 5,
    comment: 'A study in chromatic proportion. The deep maroon has mineral depth that shifts depending on warm versus cool LED lighting.',
    placedAt: daysAgo(101),
    verified: true,
    featured: false,
    helpfulCount: 13
  },
  {
    id: 'rev-p04-07',
    productId: 'prod-04',
    customerName: 'Markus Lindt',
    customerRole: 'Design Architect',
    location: 'Basel, Switzerland',
    rating: 5,
    comment: 'Supplied for an executive boardroom. It strikes the exact note between artistic boldness and professional restraint.',
    placedAt: daysAgo(118),
    verified: true,
    featured: false,
    helpfulCount: 11
  },
  {
    id: 'rev-p04-08',
    productId: 'prod-04',
    customerName: 'Zoe Katsaros',
    customerRole: 'Residential Stylist',
    location: 'Athens, Greece',
    rating: 5,
    comment: 'Superb canvas tension and hand-finished edges. The colors match the Vernox editorial catalog photography flawlessly.',
    placedAt: daysAgo(135),
    verified: true,
    featured: false,
    helpfulCount: 7
  },
  {
    id: 'rev-p04-09',
    productId: 'prod-04',
    customerName: 'Jameson Reed',
    customerRole: 'Private Collector',
    location: 'Austin, USA',
    rating: 5,
    comment: 'Foyer edition (120x120cm) makes an unforgettable entrance statement. The certificate was signed and numbered.',
    placedAt: daysAgo(155),
    verified: true,
    featured: false,
    helpfulCount: 14
  },
  {
    id: 'rev-p04-10',
    productId: 'prod-04',
    customerName: 'Nadia Soliman',
    customerRole: 'Interior Architect',
    location: 'Dubai, UAE',
    rating: 5,
    comment: 'Our international delivery was handled seamlessly with white-glove courier status. Client was thrilled with the quality.',
    placedAt: daysAgo(178),
    verified: true,
    featured: false,
    helpfulCount: 18
  },

  // -------------------------------------------------------------
  // prod-05: Contemporary Bloom
  // -------------------------------------------------------------
  {
    id: 'rev-p05-01',
    productId: 'prod-05',
    customerName: 'Isabelle Moreau',
    customerRole: 'Head of Design, Studio Rivoli',
    location: 'Paris, France',
    rating: 5,
    comment: 'The three-dimensional relief of these plaster petals casts magnificent organic shadows throughout the day. The delicate gold leaf trim along each petal edge adds an ethereal radiance.',
    placedAt: daysAgo(9),
    verified: true,
    featured: true,
    helpfulCount: 42
  },
  {
    id: 'rev-p05-02',
    productId: 'prod-05',
    customerName: 'Alexander Wright',
    customerRole: 'Private Collector',
    location: 'Toronto, Canada',
    rating: 5,
    comment: 'The mineral plaster texture is tactile, durable, and completely hand-sculpted. Arrived in a reinforced custom wooden box with zero shipping blemishes.',
    placedAt: daysAgo(21),
    verified: true,
    featured: true,
    helpfulCount: 30
  },
  {
    id: 'rev-p05-03',
    productId: 'prod-05',
    customerName: 'Federica Rinaldi',
    customerRole: 'Architectural Consultant',
    location: 'Turin, Italy',
    rating: 5,
    comment: 'Suspended in our salon above a travertine console. The blush maroon tone is whisper-quiet yet deeply sophisticated.',
    placedAt: daysAgo(47),
    verified: true,
    featured: false,
    helpfulCount: 19
  },
  {
    id: 'rev-p05-04',
    productId: 'prod-05',
    customerName: 'Henrik Vang',
    customerRole: 'Gallery Owner',
    location: 'Aarhus, Denmark',
    rating: 5,
    comment: 'The relief depth is close to 35mm in places, creating high-drama cast shadows under warm ceiling spotlights.',
    placedAt: daysAgo(68),
    verified: true,
    featured: false,
    helpfulCount: 15
  },
  {
    id: 'rev-p05-05',
    productId: 'prod-05',
    customerName: 'Lucille Dupont',
    customerRole: 'Private Patron',
    location: 'Bordeaux, France',
    rating: 5,
    comment: 'An absolute masterpiece. Everyone who enters our home runs their fingers gently along the petal curves.',
    placedAt: daysAgo(89),
    verified: true,
    featured: false,
    helpfulCount: 21
  },
  {
    id: 'rev-p05-06',
    productId: 'prod-05',
    customerName: 'Marcus Gable',
    customerRole: 'Design Director',
    location: 'New York, USA',
    rating: 4,
    comment: 'Heavy piece that requires two people to mount securely, but the included French cleat system makes alignment straightforward.',
    placedAt: daysAgo(106),
    verified: true,
    featured: false,
    helpfulCount: 12
  },
  {
    id: 'rev-p05-07',
    productId: 'prod-05',
    customerName: 'Clara Sorensen',
    customerRole: 'Interior Designer',
    location: 'Copenhagen, Denmark',
    rating: 5,
    comment: 'Botanical inspiration translated through rigorous architectural restraint. The gold powder contours shimmer delicately.',
    placedAt: daysAgo(125),
    verified: true,
    featured: false,
    helpfulCount: 16
  },
  {
    id: 'rev-p05-08',
    productId: 'prod-05',
    customerName: 'Bernardo Silva',
    customerRole: 'Private Collector',
    location: 'Lisbon, Portugal',
    rating: 5,
    comment: 'Outstanding artisan craftsmanship. You can see the hand sculpting marks of the atelier artisan.',
    placedAt: daysAgo(143),
    verified: true,
    featured: false,
    helpfulCount: 14
  },
  {
    id: 'rev-p05-09',
    productId: 'prod-05',
    customerName: 'Astrid Lind',
    customerRole: 'Residential Curator',
    location: 'Oslo, Norway',
    rating: 5,
    comment: 'Grand 100x100cm edition anchors our master bedroom. It brings tranquility and organic warmth.',
    placedAt: daysAgo(162),
    verified: true,
    featured: false,
    helpfulCount: 10
  },
  {
    id: 'rev-p05-10',
    productId: 'prod-05',
    customerName: 'Thibault Mercier',
    customerRole: 'Art Consultant',
    location: 'Geneva, Switzerland',
    rating: 5,
    comment: 'Vernox continues to prove they are the benchmark for contemporary European architectural decor.',
    placedAt: daysAgo(180),
    verified: true,
    featured: false,
    helpfulCount: 17
  },

  // -------------------------------------------------------------
  // prod-06: Minimal Lines
  // -------------------------------------------------------------
  {
    id: 'rev-p06-01',
    productId: 'prod-06',
    customerName: 'Kenzo Takahashi',
    customerRole: 'Minimalist Architect',
    location: 'Tokyo, Japan',
    rating: 5,
    comment: 'The unbroken single-line contour in deep espresso ink and gold leaf filaments embodies perfect restraint. The heavyweight cotton rag paper has a deckled edge of exquisite purity.',
    placedAt: daysAgo(14),
    verified: true,
    featured: true,
    helpfulCount: 36
  },
  {
    id: 'rev-p06-02',
    productId: 'prod-06',
    customerName: 'Sophie Van Dijk',
    customerRole: 'Design Journalist',
    location: 'Rotterdam, Netherlands',
    rating: 5,
    comment: 'A masterclass in eliminating the superfluous. Paired with a slender black aluminum float frame, it transforms our study into a sanctuary.',
    placedAt: daysAgo(33),
    verified: true,
    featured: true,
    helpfulCount: 25
  },
  {
    id: 'rev-p06-03',
    productId: 'prod-06',
    customerName: 'Charles Montgomery',
    customerRole: 'Private Patron',
    location: 'Oxford, UK',
    rating: 5,
    comment: 'The gold filament glints with subtle subtlety. Elegant, intellectual, and timeless.',
    placedAt: daysAgo(52),
    verified: true,
    featured: false,
    helpfulCount: 18
  },
  {
    id: 'rev-p06-04',
    productId: 'prod-06',
    customerName: 'Helena Berg',
    customerRole: 'Interior Stylist',
    location: 'Stockholm, Sweden',
    rating: 5,
    comment: 'The Large 90x120cm size has immense presence without demanding aggressive attention. Supreme subtlety.',
    placedAt: daysAgo(75),
    verified: true,
    featured: false,
    helpfulCount: 14
  },
  {
    id: 'rev-p06-05',
    productId: 'prod-06',
    customerName: 'Mathieu Laurent',
    customerRole: 'Architect',
    location: 'Brussels, Belgium',
    rating: 4,
    comment: 'Very fine craftsmanship. Paper quality is archival heavy rag. Beautiful framing.',
    placedAt: daysAgo(94),
    verified: true,
    featured: false,
    helpfulCount: 9
  },
  {
    id: 'rev-p06-06',
    productId: 'prod-06',
    customerName: 'Diane Sterling',
    customerRole: 'Collector',
    location: 'New York, USA',
    rating: 5,
    comment: 'Looks like an original drawing directly from a master’s atelier sketchpad. Authenticated numbered seal on the reverse.',
    placedAt: daysAgo(112),
    verified: true,
    featured: false,
    helpfulCount: 16
  },
  {
    id: 'rev-p06-07',
    productId: 'prod-06',
    customerName: 'Rami Al-Mansoor',
    customerRole: 'Corporate Curator',
    location: 'Doha, Qatar',
    rating: 5,
    comment: 'Specified five pieces for our executive offices. The consistency across all framed editions was immaculate.',
    placedAt: daysAgo(131),
    verified: true,
    featured: false,
    helpfulCount: 12
  },
  {
    id: 'rev-p06-08',
    productId: 'prod-06',
    customerName: 'Gisela Hoffmann',
    customerRole: 'Private Patron',
    location: 'Hamburg, Germany',
    rating: 5,
    comment: 'Simple, pure, and deeply calming to contemplate. Unboxing was a pleasure.',
    placedAt: daysAgo(149),
    verified: true,
    featured: false,
    helpfulCount: 11
  },
  {
    id: 'rev-p06-09',
    productId: 'prod-06',
    customerName: 'Pascal Renard',
    customerRole: 'Architectural Consultant',
    location: 'Nantes, France',
    rating: 5,
    comment: 'Precision vector-accurate contour. A piece that will never look dated.',
    placedAt: daysAgo(167),
    verified: true,
    featured: false,
    helpfulCount: 8
  },
  {
    id: 'rev-p06-10',
    productId: 'prod-06',
    customerName: 'Emily Watson',
    customerRole: 'Residential Designer',
    location: 'Edinburgh, UK',
    rating: 5,
    comment: 'Delivered in mint condition with personalized note from the Vernox workshop.',
    placedAt: daysAgo(185),
    verified: true,
    featured: false,
    helpfulCount: 13
  },

  // -------------------------------------------------------------
  // prod-07: Bronze Figure
  // -------------------------------------------------------------
  {
    id: 'rev-p07-01',
    productId: 'prod-07',
    customerName: 'Dr. Alistair Sterling',
    customerRole: 'Curator, Fine Arts Foundation',
    location: 'Edinburgh, UK',
    rating: 5,
    comment: 'Lost-wax cast in solid bronze with a tactile earthy verdigris patina that evokes mid-century Italian modernist masters. The solid travertine cube plinth is honed with razor-flat geometry.',
    placedAt: daysAgo(7),
    verified: true,
    featured: true,
    helpfulCount: 41
  },
  {
    id: 'rev-p07-02',
    productId: 'prod-07',
    customerName: 'Victoire de Castellane',
    customerRole: 'Private Art Collector',
    location: 'Paris, France',
    rating: 5,
    comment: 'We acquired the Console 72cm height edition. The slender silhouette holds immense spatial presence in our entryway.',
    placedAt: daysAgo(23),
    verified: true,
    featured: true,
    helpfulCount: 33
  },
  {
    id: 'rev-p07-03',
    productId: 'prod-07',
    customerName: 'Marco Bellini',
    customerRole: 'Architect & Interior Designer',
    location: 'Milan, Italy',
    rating: 5,
    comment: 'The weight of solid bronze cannot be faked. It feels cold, dense, and permanent. Superb work by the Antwerp foundry.',
    placedAt: daysAgo(41),
    verified: true,
    featured: false,
    helpfulCount: 22
  },
  {
    id: 'rev-p07-04',
    productId: 'prod-07',
    customerName: 'Hanna Lindstrom',
    customerRole: 'Sculpture Enthusiast',
    location: 'Gothenburg, Sweden',
    rating: 5,
    comment: 'Reminiscent of Giacometti with a clean modern finish. The travertine stone base is heavy and sturdy.',
    placedAt: daysAgo(63),
    verified: true,
    featured: false,
    helpfulCount: 17
  },
  {
    id: 'rev-p07-05',
    productId: 'prod-07',
    customerName: 'Christian Vogel',
    customerRole: 'Private Patron',
    location: 'Frankfurt, Germany',
    rating: 4,
    comment: 'Exceptional casting quality. Arrived bolted down in custom plywood crate. Truly premium service.',
    placedAt: daysAgo(84),
    verified: true,
    featured: false,
    helpfulCount: 11
  },
  {
    id: 'rev-p07-06',
    productId: 'prod-07',
    customerName: 'Samantha Ross',
    customerRole: 'Hospitality Director',
    location: 'Los Angeles, USA',
    rating: 5,
    comment: 'Placed on a central marble shelf in our boutique hotel suite. Guests constantly inquire where it was acquired.',
    placedAt: daysAgo(103),
    verified: true,
    featured: false,
    helpfulCount: 19
  },
  {
    id: 'rev-p07-07',
    productId: 'prod-07',
    customerName: 'Olivier Marchand',
    customerRole: 'Art Consultant',
    location: 'Geneva, Switzerland',
    rating: 5,
    comment: 'Earth patina finish is subtle and rich. Every nuance of the bronze mold was preserved.',
    placedAt: daysAgo(122),
    verified: true,
    featured: false,
    helpfulCount: 14
  },
  {
    id: 'rev-p07-08',
    productId: 'prod-07',
    customerName: 'Lars Nystrom',
    customerRole: 'Architect',
    location: 'Stockholm, Sweden',
    rating: 5,
    comment: 'A timeless silhouette that commands quiet respect. Solid heirloom piece.',
    placedAt: daysAgo(145),
    verified: true,
    featured: false,
    helpfulCount: 9
  },
  {
    id: 'rev-p07-09',
    productId: 'prod-07',
    customerName: 'Camille Benoit',
    customerRole: 'Private Collector',
    location: 'Cannes, France',
    rating: 5,
    comment: 'The signed authenticity card with Antwerp hallmark wax seal was a magnificent touch.',
    placedAt: daysAgo(166),
    verified: true,
    featured: false,
    helpfulCount: 16
  },
  {
    id: 'rev-p07-10',
    productId: 'prod-07',
    customerName: 'Edward Harrison',
    customerRole: 'Private Patron',
    location: 'London, UK',
    rating: 5,
    comment: 'Ten out of ten in design, metallurgical density, and presentation.',
    placedAt: daysAgo(188),
    verified: true,
    featured: false,
    helpfulCount: 15
  },

  // -------------------------------------------------------------
  // prod-08: Textured Canvas
  // -------------------------------------------------------------
  {
    id: 'rev-p08-01',
    productId: 'prod-08',
    customerName: 'Charlotte Dubois',
    customerRole: 'Principal Curator, Galerie Marais',
    location: 'Paris, France',
    rating: 5,
    comment: 'The three-dimensional radial brass planes float 20mm off the wall, producing shifting concentric shadow rings as sunlight moves through the salon. Remarkable metallurgical ingenuity.',
    placedAt: daysAgo(10),
    verified: true,
    featured: true,
    helpfulCount: 39
  },
  {
    id: 'rev-p08-02',
    productId: 'prod-08',
    customerName: 'Henrik Vane',
    customerRole: 'Interior Architect',
    location: 'Copenhagen, Denmark',
    rating: 5,
    comment: 'We installed the Grand 120cm diameter edition over an oak credenza. The acoustic absorption and sculptural warmth it introduces are phenomenal.',
    placedAt: daysAgo(27),
    verified: true,
    featured: true,
    helpfulCount: 28
  },
  {
    id: 'rev-p08-03',
    productId: 'prod-08',
    customerName: 'Guillaume Lemercier',
    customerRole: 'Private Patron',
    location: 'Brussels, Belgium',
    rating: 5,
    comment: 'The hand-applied patina gives the concentric circles a warm earthen glow that changes with evening dimmer lighting.',
    placedAt: daysAgo(46),
    verified: true,
    featured: false,
    helpfulCount: 19
  },
  {
    id: 'rev-p08-04',
    productId: 'prod-08',
    customerName: 'Miriam Al-Khatib',
    customerRole: 'Design Consultant',
    location: 'Dubai, UAE',
    rating: 5,
    comment: 'Custom standoff wall fixings are solid brass and completely concealed. Installation took less than 20 minutes.',
    placedAt: daysAgo(69),
    verified: true,
    featured: false,
    helpfulCount: 15
  },
  {
    id: 'rev-p08-05',
    productId: 'prod-08',
    customerName: 'Lucas Weber',
    customerRole: 'Architect',
    location: 'Zurich, Switzerland',
    rating: 4,
    comment: 'Heavy piece with high-grade metalwork. The radial layers are rigidly structured and will not warp over time.',
    placedAt: daysAgo(91),
    verified: true,
    featured: false,
    helpfulCount: 12
  },
  {
    id: 'rev-p08-06',
    productId: 'prod-08',
    customerName: 'Evelyn Scott',
    customerRole: 'Private Collector',
    location: 'Seattle, USA',
    rating: 5,
    comment: 'A true centerpiece. The combination of brass and textural earthen impasto is timelessly elegant.',
    placedAt: daysAgo(114),
    verified: true,
    featured: false,
    helpfulCount: 17
  },
  {
    id: 'rev-p08-07',
    productId: 'prod-08',
    customerName: 'Thomas De Graaf',
    customerRole: 'Art Consultant',
    location: 'Antwerp, Belgium',
    rating: 5,
    comment: 'Visiting the atelier confirmed what the piece proves: master craftsmanship with deep metallurgy roots.',
    placedAt: daysAgo(133),
    verified: true,
    featured: false,
    helpfulCount: 13
  },
  {
    id: 'rev-p08-08',
    productId: 'prod-08',
    customerName: 'Valerie Dupont',
    customerRole: 'Interior Designer',
    location: 'Nice, France',
    rating: 5,
    comment: 'Clients were speechless when it was unveiled. The packaging was indestructible.',
    placedAt: daysAgo(152),
    verified: true,
    featured: false,
    helpfulCount: 10
  },
  {
    id: 'rev-p08-09',
    productId: 'prod-08',
    customerName: 'Simon Kroll',
    customerRole: 'Private Patron',
    location: 'Munich, Germany',
    rating: 5,
    comment: 'Precision radial alignment down to the millimeter. Very impressed with the quality.',
    placedAt: daysAgo(171),
    verified: true,
    featured: false,
    helpfulCount: 8
  },
  {
    id: 'rev-p08-10',
    productId: 'prod-08',
    customerName: 'Helena Cruz',
    customerRole: 'Architectural Stylist',
    location: 'Madrid, Spain',
    rating: 5,
    comment: 'Exceptional texture, rich tones, and museum-grade hangings included.',
    placedAt: daysAgo(190),
    verified: true,
    featured: false,
    helpfulCount: 14
  },

  // -------------------------------------------------------------
  // p-01: Ember Round Frame
  // -------------------------------------------------------------
  {
    id: 'rev-p01a-01',
    productId: 'p-01',
    customerName: 'Jonathan Vance',
    customerRole: 'Architectural Director, Studio Vance',
    location: 'London, UK',
    rating: 5,
    comment: 'The hairline brushed texture on solid 3.0mm Belgian CZ108 brass is sensational. Suspended with hidden hardware, it appears to float completely weightless against dark timber paneling.',
    placedAt: daysAgo(13),
    verified: true,
    featured: true,
    helpfulCount: 35
  },
  {
    id: 'rev-p01a-02',
    productId: 'p-01',
    customerName: 'Beatrice Fontaine',
    customerRole: 'Private Art Collector',
    location: 'Brussels, Belgium',
    rating: 5,
    comment: 'The circular geometry is true to within a fraction of a millimeter. The warm gold patina is rich without looking gaudy.',
    placedAt: daysAgo(28),
    verified: true,
    featured: true,
    helpfulCount: 27
  },
  {
    id: 'rev-p01a-03',
    productId: 'p-01',
    customerName: 'Martin Keller',
    customerRole: 'Interior Designer',
    location: 'Frankfurt, Germany',
    rating: 5,
    comment: 'We mounted three in different diameters (30cm, 50cm, 80cm) down a long gallery corridor. The floating effect is sublime.',
    placedAt: daysAgo(49),
    verified: true,
    featured: false,
    helpfulCount: 19
  },
  {
    id: 'rev-p01a-04',
    productId: 'p-01',
    customerName: 'Sybille Laurent',
    customerRole: 'Private Patron',
    location: 'Geneva, Switzerland',
    rating: 5,
    comment: 'Substantial weight in solid brass. The unboxing was a luxury ritual in itself.',
    placedAt: daysAgo(72),
    verified: true,
    featured: false,
    helpfulCount: 16
  },
  {
    id: 'rev-p01a-05',
    productId: 'p-01',
    customerName: 'Arthur Pendelton',
    customerRole: 'Senior Architect',
    location: 'Manchester, UK',
    rating: 4,
    comment: 'Extremely clean CNC edge cut. Precision hardware included for masonry or drywall mounting.',
    placedAt: daysAgo(95),
    verified: true,
    featured: false,
    helpfulCount: 11
  },
  {
    id: 'rev-p01a-06',
    productId: 'p-01',
    customerName: 'Camille Renaud',
    customerRole: 'Gallery Director',
    location: 'Paris, France',
    rating: 5,
    comment: 'The subtle grain catches moving room light softly. Exceptional attention to metallurgical details.',
    placedAt: daysAgo(116),
    verified: true,
    featured: false,
    helpfulCount: 14
  },
  {
    id: 'rev-p01a-07',
    productId: 'p-01',
    customerName: 'David Nygren',
    customerRole: 'Private Collector',
    location: 'Stockholm, Sweden',
    rating: 5,
    comment: 'Solid metal art with genuine soul. Arrived with numbered Antwerp certificate.',
    placedAt: daysAgo(137),
    verified: true,
    featured: false,
    helpfulCount: 10
  },
  {
    id: 'rev-p01a-08',
    productId: 'p-01',
    customerName: 'Elena Varga',
    customerRole: 'Residential Stylist',
    location: 'Vienna, Austria',
    rating: 5,
    comment: 'Third time specifying Vernox frames for private residences. Always beyond expectations.',
    placedAt: daysAgo(156),
    verified: true,
    featured: false,
    helpfulCount: 13
  },
  {
    id: 'rev-p01a-09',
    productId: 'p-01',
    customerName: 'Philippe Moreau',
    customerRole: 'Architect',
    location: 'Lyon, France',
    rating: 5,
    comment: 'The standoffs provide exactly the 20mm shadow line required for museum lighting.',
    placedAt: daysAgo(174),
    verified: true,
    featured: false,
    helpfulCount: 8
  },
  {
    id: 'rev-p01a-10',
    productId: 'p-01',
    customerName: 'Clara Hughes',
    customerRole: 'Private Patron',
    location: 'Dublin, Ireland',
    rating: 5,
    comment: 'Worth every single penny. It looks like an ancient astronomical instrument.',
    placedAt: daysAgo(192),
    verified: true,
    featured: false,
    helpfulCount: 12
  },

  // -------------------------------------------------------------
  // p-02: Atrium Square
  // -------------------------------------------------------------
  {
    id: 'rev-p02a-01',
    productId: 'p-02',
    customerName: 'Frederik Lind',
    customerRole: 'Principal, Nordik Studio',
    location: 'Copenhagen, Denmark',
    rating: 5,
    comment: 'Solid structural steel in blackened patina. Over our board-formed concrete fireplace, it provides raw architectural gravity and razor-sharp perimeter lines.',
    placedAt: daysAgo(16),
    verified: true,
    featured: true,
    helpfulCount: 32
  },
  {
    id: 'rev-p02a-02',
    productId: 'p-02',
    customerName: 'Valerie Sterling',
    customerRole: 'Private Collector',
    location: 'Zurich, Switzerland',
    rating: 5,
    comment: 'The weathering corten patina option was hand-accelerated and stabilized with archival sealant. Zero rust shedding on our plastered walls.',
    placedAt: daysAgo(31),
    verified: true,
    featured: true,
    helpfulCount: 23
  },
  {
    id: 'rev-p02a-03',
    productId: 'p-02',
    customerName: 'Christian Weber',
    customerRole: 'Architect',
    location: 'Berlin, Germany',
    rating: 5,
    comment: 'Exact 90-degree internal miter joints. Standoff brackets are rock-solid and completely hidden.',
    placedAt: daysAgo(55),
    verified: true,
    featured: false,
    helpfulCount: 18
  },
  {
    id: 'rev-p02a-04',
    productId: 'p-02',
    customerName: 'Sophie Bernard',
    customerRole: 'Interior Stylist',
    location: 'Paris, France',
    rating: 5,
    comment: 'Minimalist perfection. Blackened steel has warm graphite undertones in natural sunlight.',
    placedAt: daysAgo(78),
    verified: true,
    featured: false,
    helpfulCount: 14
  },
  {
    id: 'rev-p02a-05',
    productId: 'p-02',
    customerName: 'Markus Bauer',
    customerRole: 'Private Patron',
    location: 'Munich, Germany',
    rating: 4,
    comment: 'Very heavy and robust steel plate. Takes two people to mount smoothly, but the result is stunning.',
    placedAt: daysAgo(98),
    verified: true,
    featured: false,
    helpfulCount: 9
  },
  {
    id: 'rev-p02a-06',
    productId: 'p-02',
    customerName: 'Amelie Mercier',
    customerRole: 'Curator',
    location: 'Bordeaux, France',
    rating: 5,
    comment: 'Superb precision. You cannot find frames of this metallurgical caliber at standard galleries.',
    placedAt: daysAgo(119),
    verified: true,
    featured: false,
    helpfulCount: 15
  },
  {
    id: 'rev-p02a-07',
    productId: 'p-02',
    customerName: 'Lukas Nygard',
    customerRole: 'Design Consultant',
    location: 'Stockholm, Sweden',
    rating: 5,
    comment: 'Architectural steel at its finest. Highly recommended for brutalist and minimalist interiors.',
    placedAt: daysAgo(140),
    verified: true,
    featured: false,
    helpfulCount: 11
  },
  {
    id: 'rev-p02a-08',
    productId: 'p-02',
    customerName: 'Elena Moretti',
    customerRole: 'Private Collector',
    location: 'Milan, Italy',
    rating: 5,
    comment: 'Arrived in bulletproof packaging with signed authentication documents.',
    placedAt: daysAgo(160),
    verified: true,
    featured: false,
    helpfulCount: 13
  },
  {
    id: 'rev-p02a-09',
    productId: 'p-02',
    customerName: 'Daniel Clark',
    customerRole: 'Residential Architect',
    location: 'Edinburgh, UK',
    rating: 5,
    comment: 'Clean, bold, and meticulously deburred edges.',
    placedAt: daysAgo(179),
    verified: true,
    featured: false,
    helpfulCount: 7
  },
  {
    id: 'rev-p02a-10',
    productId: 'p-02',
    customerName: 'Clara Dubois',
    customerRole: 'Private Patron',
    location: 'Lille, France',
    rating: 5,
    comment: 'Exceeds every expectation. A permanent piece of architecture.',
    placedAt: daysAgo(198),
    verified: true,
    featured: false,
    helpfulCount: 10
  },

  // -------------------------------------------------------------
  // p-03: Nova Star
  // -------------------------------------------------------------
  {
    id: 'rev-p03a-01',
    productId: 'p-03',
    customerName: 'Guillaume de Vigny',
    customerRole: 'Director, Vigny Interiors',
    location: 'Paris, France',
    rating: 5,
    comment: 'The five-point starburst relief in 24K gilded Belgian brass is breathtaking. The acute angles are crisp without sharp edges, casting five radial shadow facets across the wall.',
    placedAt: daysAgo(17),
    verified: true,
    featured: true,
    helpfulCount: 37
  },
  {
    id: 'rev-p03a-02',
    productId: 'p-03',
    customerName: 'Helena Falk',
    customerRole: 'Private Collector',
    location: 'Stockholm, Sweden',
    rating: 5,
    comment: 'Gold leaf finish glows warmly in our library nook. Arrived with custom magnetic standoffs that align flawlessly.',
    placedAt: daysAgo(36),
    verified: true,
    featured: true,
    helpfulCount: 24
  },
  {
    id: 'rev-p03a-03',
    productId: 'p-03',
    customerName: 'Arthur Vance',
    customerRole: 'Architect',
    location: 'London, UK',
    rating: 5,
    comment: 'Laser-cut tolerances are immaculate. Heavy 3mm brass plate that feels indestructible.',
    placedAt: daysAgo(58),
    verified: true,
    featured: false,
    helpfulCount: 16
  },
  {
    id: 'rev-p03a-04',
    productId: 'p-03',
    customerName: 'Marie-Claire Laurent',
    customerRole: 'Private Patron',
    location: 'Brussels, Belgium',
    rating: 5,
    comment: 'An exquisite piece of jewelry for the home wall. Stunning gilding.',
    placedAt: daysAgo(81),
    verified: true,
    featured: false,
    helpfulCount: 13
  },
  {
    id: 'rev-p03a-05',
    productId: 'p-03',
    customerName: 'Stefano Ricci',
    customerRole: 'Design Consultant',
    location: 'Florence, Italy',
    rating: 5,
    comment: 'Perfect celestial geometry without feeling novelty. Pure high-end atelier work.',
    placedAt: daysAgo(102),
    verified: true,
    featured: false,
    helpfulCount: 15
  },
  {
    id: 'rev-p03a-06',
    productId: 'p-03',
    customerName: 'Clara Jenkins',
    customerRole: 'Homeowner',
    location: 'Toronto, Canada',
    rating: 4,
    comment: 'Lovely piece. The medium 40cm size was perfect for our stairway gallery wall.',
    placedAt: daysAgo(124),
    verified: true,
    featured: false,
    helpfulCount: 8
  },
  {
    id: 'rev-p03a-07',
    productId: 'p-03',
    customerName: 'David Sorensen',
    customerRole: 'Architectural Consultant',
    location: 'Oslo, Norway',
    rating: 5,
    comment: 'Uncompromising metallurgical standards. Vernox is in a class of its own.',
    placedAt: daysAgo(144),
    verified: true,
    featured: false,
    helpfulCount: 11
  },
  {
    id: 'rev-p03a-08',
    productId: 'p-03',
    customerName: 'Emilie Dupont',
    customerRole: 'Private Collector',
    location: 'Nantes, France',
    rating: 5,
    comment: 'The hallmark seal on the reverse certifies its noble Belgian origin. Truly beautiful.',
    placedAt: daysAgo(163),
    verified: true,
    featured: false,
    helpfulCount: 10
  },
  {
    id: 'rev-p03a-09',
    productId: 'p-03',
    customerName: 'Klaus Lindner',
    customerRole: 'Interior Designer',
    location: 'Vienna, Austria',
    rating: 5,
    comment: 'Clients were deeply moved by the precision of the starburst angles.',
    placedAt: daysAgo(182),
    verified: true,
    featured: false,
    helpfulCount: 7
  },
  {
    id: 'rev-p03a-10',
    productId: 'p-03',
    customerName: 'Nadia El-Baz',
    customerRole: 'Curator',
    location: 'Beirut, Lebanon',
    rating: 5,
    comment: 'Remarkable packaging and prompt international dispatch. Flawless gold finish.',
    placedAt: daysAgo(199),
    verified: true,
    featured: false,
    helpfulCount: 12
  },

  // -------------------------------------------------------------
  // Generic helper generator for remaining catalog items (p-04 to p-12)
  // to ensure EVERY product has 10 rich, credible reviews!
  // -------------------------------------------------------------
];

// Seed generator to guarantee 10 rich reviews for ALL other catalog products
const remainingProductConfigs: Record<string, {
  name: string;
  theme: string;
  material: string;
  architectReview: string;
  collectorReview: string;
}> = {
  'p-04': {
    name: 'Monarch Heart',
    theme: 'anniversary keepsake & sculpted metal love tribute',
    material: 'solid 3.0mm aged copper and warm gold bevel',
    architectReview: 'The soft architectural radius on 3.0mm aged copper avoids sentimentality while celebrating profound intimacy. Custom laser-engraved monogram was millimeter-sharp.',
    collectorReview: 'Commissioned for our 20th anniversary. The warm copper tones glow beside our fireplace and will patina gracefully over generations.'
  },
  'p-05': {
    name: 'Apollo Hexagon',
    theme: 'modular honeycomb art and geometric wall relief',
    material: 'hand-grained brass and blackened steel hex tiles',
    architectReview: 'We arranged the Trio 20cm set into an asymmetric honeycomb above an executive desk. The precision of the 120-degree angles allows seam-perfect adjoining configurations.',
    collectorReview: 'The modular flexibility is brilliant. The brass surface has a tactile brushed luster that catches morning light from the garden terrace.'
  },
  'p-06': {
    name: 'Compass Rose',
    theme: 'eight-point maritime navigational relief',
    material: 'marine-grade 304 stainless steel & 24K gilded accents',
    architectReview: 'Anchors our seaside residence entryway with nautical gravitas. Marine-grade 304 stainless has zero corrosion vulnerability, even in saline coastal air.',
    collectorReview: 'The eight facets create dynamic geometric reflections as ambient daylight shifts. Arrived with an official maritime-grade inspection certificate.'
  },
  'p-07': {
    name: 'Foliage Leaf',
    theme: 'botanical cutout and weathering corten organic form',
    material: 'pre-weathered architectural corten steel',
    architectReview: 'Botanical form rendered in structural corten steel. The natural velvet-like rust patina creates a startling dialogue with our smooth lime-washed walls.',
    collectorReview: 'The stabilized corten finish leaves no marks on the wall while retaining all the natural rich earthen umber tones of weathered alloy.'
  },
  'p-08': {
    name: 'Harbor Wave',
    theme: 'triple-layer coastal ocean wave silhouette',
    material: 'triple-layer 3.0mm stainless and polished brass',
    architectReview: 'Three layered metal planes floating at 10mm increments recreate the depth of deep oceanic swells. A tour de force of layered metallurgical relief.',
    collectorReview: 'The interplay between polished brass and brushed marine stainless catches room lighting like real sunlight breaking across rolling water.'
  },
  'p-09': {
    name: 'Octet Frame',
    theme: 'eight-sided geometric display and mitered frame',
    material: 'solid 3.0mm Belgian brass with mitered inner bevel',
    architectReview: 'An eight-sided octagon with flawless 45-degree mitered bevels. Far more sophisticated than a round frame, commanding an entryway gallery with royal authority.',
    collectorReview: 'The hand-burnished brass edge is mirror-smooth. Sturdy hanging standoffs ensure it sits absolutely plumb and floats elegantly off the plaster.'
  },
  'p-10': {
    name: 'Aegis Shield',
    theme: 'heraldic crest silhouette and family crest plaque',
    material: '3.0mm hand-forged steel with atelier hallmark stamp',
    architectReview: 'We commissioned custom family heraldry engraved into this heavy 3.0mm forged steel shield. The atelier hallmark seal stamped into the lower rim is unforgettable.',
    collectorReview: 'Substantial weight that speaks of heirloom permanence. It honors ancestral tradition through modern European metallurgical precision.'
  },
  'p-11': {
    name: 'Triad',
    theme: 'three-point minimalist triangular sculpture',
    material: 'polished pure copper and blackened steel',
    architectReview: 'The absolute pinnacle of geometric purity. Three razor-sharp vertices in polished copper that command negative space with mathematical elegance.',
    collectorReview: 'Minimalist, sharp, and strikingly warm against dark charcoal walls. Unboxing with white handling gloves felt like receiving crown jewels.'
  },
  'p-12': {
    name: 'Pentacle Frame',
    theme: 'architectural five-sided pentagon display',
    material: 'brushed brass and stainless steel alloy',
    architectReview: 'A five-sided architectural frame that challenges conventional square boundaries. The internal shadow ring produced by the 20mm standoffs is sheer perfection.',
    collectorReview: 'Holds a bespoke photographic print in our loft salon. Friends constantly ask where this unique geometric frame was commissioned.'
  }
};

// Generate 10 reviews for remaining items
Object.entries(remainingProductConfigs).forEach(([pId, conf]) => {
  const patronNames = [
    { name: 'Dr. Henrik Lindqvist', role: 'Principal Architect, Studio Stockholm', loc: 'Stockholm, Sweden' },
    { name: 'Camille Laurent', role: 'Curator, Galerie Marais', loc: 'Paris, France' },
    { name: 'Marcus Van Houten', role: 'Architectural Director, Studio Antwerp', loc: 'Antwerp, Belgium' },
    { name: 'Elena Rostova', role: 'Private Art Collector', loc: 'Zurich, Switzerland' },
    { name: 'Julian Sterling', role: 'Design Director, Sterling Associates', loc: 'London, UK' },
    { name: 'Sofia Moretti', role: 'Hospitality Interior Designer', loc: 'Milan, Italy' },
    { name: 'Kenzo Takahashi', role: 'Minimalist Architect', loc: 'Tokyo, Japan' },
    { name: 'Charlotte Dubois', role: 'Senior Partner, Dubois Design', loc: 'Geneva, Switzerland' },
    { name: 'Amira El-Sayed', role: 'Architectural Consultant', loc: 'Dubai, UAE' },
    { name: 'Lucas Weber', role: 'Private Patron & Collector', loc: 'Munich, Germany' }
  ];

  const genericComments = [
    `The ${conf.material} delivers exceptional architectural gravity. Seamless laser-cut tolerances make mounting effortless and precise.`,
    `Delivered in a reinforced timber atelier crate with signed certificate of authenticity. The ${conf.theme} is a masterwork.`,
    `Superb hand-finished patina that responds dynamically to changing natural light throughout the salon.`,
    `The 20mm concealed standoffs create a pristine shadow line. Vernox maintains an unmatched standard of European craftsmanship.`,
    `Substantial physical weight and immaculate surface finishing. Perfectly complements our modern minimalist interior.`,
    `A standout acquisition. The metallurgical edge accuracy and deburred bevels are flawless down to the millimeter.`,
    `Commissioned for an executive residential project. Client was astonished by the tactile authenticity and provenance.`,
    `Every detail from the hallmark stamp to the museum packaging conveys heirloom nobility.`
  ];

  // 1. Featured Architect Review
  defaultReviews.push({
    id: `rev-${pId}-01`,
    productId: pId,
    customerName: patronNames[0].name,
    customerRole: patronNames[0].role,
    location: patronNames[0].loc,
    rating: 5,
    comment: conf.architectReview,
    placedAt: daysAgo(10 + Math.floor(Math.random() * 8)),
    verified: true,
    featured: true,
    helpfulCount: 32 + Math.floor(Math.random() * 15)
  });

  // 2. Featured Collector Review
  defaultReviews.push({
    id: `rev-${pId}-02`,
    productId: pId,
    customerName: patronNames[1].name,
    customerRole: patronNames[1].role,
    location: patronNames[1].loc,
    rating: 5,
    comment: conf.collectorReview,
    placedAt: daysAgo(25 + Math.floor(Math.random() * 10)),
    verified: true,
    featured: true,
    helpfulCount: 22 + Math.floor(Math.random() * 12)
  });

  // 3-10: 8 additional realistic reviews for this product
  for (let i = 2; i < 10; i++) {
    const patron = patronNames[i];
    const isFive = i !== 5; // one 4-star for authenticity
    defaultReviews.push({
      id: `rev-${pId}-0${i + 1}`,
      productId: pId,
      customerName: patron.name,
      customerRole: patron.role,
      location: patron.loc,
      rating: isFive ? 5 : 4,
      comment: genericComments[i - 2],
      placedAt: daysAgo(40 + i * 15 + Math.floor(Math.random() * 5)),
      verified: true,
      featured: false,
      helpfulCount: 8 + Math.floor(Math.random() * 14)
    });
  }
});
