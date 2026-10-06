"use client";

import { useState } from "react";

const WETSUIT_SIZES = ["S", "M", "L", "XL"];
const CERTIFICATIONS = ["Open Water", "Advanced Open Water", "Rescue Diver"];
const FIN_SIZE_OPTIONS = [
  ...Array.from({ length: 11 }, (_, index) => `US ${index + 4}`),
  ...Array.from({ length: 12 }, (_, index) => `EU ${index + 36}`),
  ...Array.from({ length: 10 }, (_, index) => `MX ${index + 22}`),
];

function FinSizeSelect({ value, onChange, id }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      Talla de aletas
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="w-full rounded border bg-white p-2"
      >
        <option value="">Selecciona talla</option>
        {FIN_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
  );
}

function WetsuitSizeSelect({ value, onChange, id }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      Talla de traje
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="w-full rounded border bg-white p-2"
      >
        <option value="">Selecciona talla</option>
        {WETSUIT_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
  );
}

function CertificationSelect({ value, onChange, id }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      Certificación
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded border bg-white p-2"
      >
        <option value="">Selecciona certificación</option>
        {CERTIFICATIONS.map((certification) => (
          <option key={certification} value={certification}>
            {certification}
          </option>
        ))}
      </select>
    </label>
  );
}

function DivesInput({ value, onChange, id }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      Número de buceos
      <input
        id={id}
        type="number"
        min="0"
        step="1"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="w-full rounded border p-2"
      />
    </label>
  );
}

export default function GuestForm({ tour, selectedDate }) {
  const [loading, setLoading] = useState(false);
  const [paymentOption, setPaymentOption] = useState("deposit");

  // cliente principal
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // tallas
  const [finSize, setFinSize] = useState("");
  const [bcdSize, setBcdSize] = useState("");
  const [wetsuitSize, setWetsuitSize] = useState("");
  const [certification, setCertification] = useState("");
  const [numberOfDives, setNumberOfDives] = useState("0");

  // acompañantes
  const [companions, setCompanions] = useState([]);

  const maxCompanions = Math.max(0, Number(tour.max_capacity || 1) - 1);

  const createCompanion = () => ({
    id: crypto.randomUUID(),
    name: "",
    finSize: "",
    bcdSize: "",
    wetsuitSize: "",
    certification: "",
    numberOfDives: "0",
  });

  const setCompanionCount = (count) => {
    const nextCount = Math.min(maxCompanions, Math.max(0, count));
    setCompanions((current) => {
      if (nextCount <= current.length) return current.slice(0, nextCount);
      return [
        ...current,
        ...Array.from({ length: nextCount - current.length }, createCompanion),
      ];
    });
  };

  const handleCompanionChange = (id, field, value) => {
    setCompanions((current) =>
      current.map((companion) =>
        companion.id === id ? { ...companion, [field]: value } : companion,
      ),
    );
  };

  const removeCompanion = (id) => {
    setCompanions((current) =>
      current.filter((companion) => companion.id !== id),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tour,
        selectedDate,
        customer: {
          name,
          email,
          phone,
          finSize,
          bcdSize,
          wetsuitSize,
          certification,
          numberOfDives,
        },
        companions,
        paymentOption,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Error creando pago");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-gray-50 p-6 rounded-xl shadow"
    >
      <h2 className="font-bold text-lg">Información del cliente</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <section className="space-y-3">
        <h3 className="font-semibold mt-4">Tu equipo y experiencia</h3>
        <FinSizeSelect
          id="customer-fin-size"
          value={finSize}
          onChange={setFinSize}
        />
        {tour.type === "SCUBA" && (
          <label className="flex flex-col gap-1 text-sm">
            Talla BCD
            <input
              value={bcdSize}
              onChange={(event) => setBcdSize(event.target.value)}
              required
              className="w-full rounded border p-2"
            />
          </label>
        )}
        <WetsuitSizeSelect
          id="customer-wetsuit-size"
          value={wetsuitSize}
          onChange={setWetsuitSize}
        />
        <CertificationSelect
          id="customer-certification"
          value={certification}
          onChange={setCertification}
        />
        <DivesInput
          id="customer-number-of-dives"
          value={numberOfDives}
          onChange={setNumberOfDives}
        />
      </section>

      <fieldset className="space-y-2">
        <legend className="font-semibold">Forma de pago</legend>
        <label className="flex cursor-pointer items-center gap-2 rounded border p-3">
          <input
            type="radio"
            name="paymentOption"
            value="deposit"
            checked={paymentOption === "deposit"}
            onChange={() => setPaymentOption("deposit")}
          />
          <span>
            Pagar depósito (20%):{" "}
            {Math.round(Number(tour.price) * (companions.length + 1) * 0.2)} MXN
          </span>
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded border p-3">
          <input
            type="radio"
            name="paymentOption"
            value="full"
            checked={paymentOption === "full"}
            onChange={() => setPaymentOption("full")}
          />
          <span>
            Pagar total: {Number(tour.price) * (companions.length + 1)} MXN
          </span>
        </label>
      </fieldset>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold">Acompañantes</h3>
            <p className="text-sm text-gray-600">Máximo {maxCompanions}</p>
          </div>
          <div
            className="flex items-center gap-3"
            aria-label="Número de acompañantes"
          >
            <button
              type="button"
              onClick={() => setCompanionCount(companions.length - 1)}
              disabled={companions.length === 0}
              aria-label="Quitar un acompañante"
              className="h-10 w-10 rounded border bg-white text-lg disabled:opacity-40"
            >
              −
            </button>
            <output className="min-w-6 text-center font-semibold">
              {companions.length}
            </output>
            <button
              type="button"
              onClick={() => setCompanionCount(companions.length + 1)}
              disabled={companions.length >= maxCompanions}
              aria-label="Agregar un acompañante"
              className="h-10 w-10 rounded border bg-white text-lg disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>

        {companions.map((companion, index) => (
          <fieldset
            key={companion.id}
            className="space-y-3 rounded-lg border bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <legend className="font-semibold">Acompañante {index + 1}</legend>
              <button
                type="button"
                onClick={() => removeCompanion(companion.id)}
                aria-label={`Quitar acompañante ${index + 1}`}
                title="Quitar acompañante"
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-600 hover:bg-gray-100 hover:text-red-600"
              >
                ×
              </button>
            </div>
            <label className="flex flex-col gap-1 text-sm">
              Nombre
              <input
                value={companion.name}
                onChange={(event) =>
                  handleCompanionChange(
                    companion.id,
                    "name",
                    event.target.value,
                  )
                }
                required
                className="w-full rounded border p-2"
              />
            </label>
            <FinSizeSelect
              id={`companion-${companion.id}-fin-size`}
              value={companion.finSize}
              onChange={(value) =>
                handleCompanionChange(companion.id, "finSize", value)
              }
            />
            {tour.type === "SCUBA" && (
              <label className="flex flex-col gap-1 text-sm">
                Talla BCD
                <input
                  value={companion.bcdSize}
                  onChange={(event) =>
                    handleCompanionChange(
                      companion.id,
                      "bcdSize",
                      event.target.value,
                    )
                  }
                  required
                  className="w-full rounded border p-2"
                />
              </label>
            )}
            <WetsuitSizeSelect
              id={`companion-${companion.id}-wetsuit-size`}
              value={companion.wetsuitSize}
              onChange={(value) =>
                handleCompanionChange(companion.id, "wetsuitSize", value)
              }
            />
            <CertificationSelect
              id={`companion-${companion.id}-certification`}
              value={companion.certification}
              onChange={(value) =>
                handleCompanionChange(companion.id, "certification", value)
              }
            />
            <DivesInput
              id={`companion-${companion.id}-number-of-dives`}
              value={companion.numberOfDives}
              onChange={(value) =>
                handleCompanionChange(companion.id, "numberOfDives", value)
              }
            />
          </fieldset>
        ))}
      </section>

      <button
        disabled={loading}
        className="bg-black text-white p-3 rounded-xl disabled:opacity-50"
      >
        {loading
          ? "Redirigiendo..."
          : paymentOption === "full"
            ? "Pagar total"
            : "Pagar depósito"}
      </button>
    </form>
  );
}
