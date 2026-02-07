export default function Info({ icon, text }) {
  return (
    <div className="flex flex-col items-center bg-gray-50 p-4 rounded-xl">
      <div className="text-primary mb-2">{icon}</div>
      <p>{text}</p>
    </div>
  );
}
