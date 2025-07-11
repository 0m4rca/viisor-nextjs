import TourCard from './TourCard';

const mockTours = [
  {
    id: '1',
    name: 'Espiritu Santo Adventure',
    description: 'Snorkel with sea lions and dive beautiful reefs.',
    price: 4000,
    imageUrl: '/espiritu.jpg',
  },
  {
    id: '2',
    name: 'El Bajo Hammerhead Dive',
    description: 'Advanced dive to spot hammerhead sharks.',
    price: 4500,
    imageUrl: '/elbajo.jpg',
  },
];

export default function TourList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {mockTours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}