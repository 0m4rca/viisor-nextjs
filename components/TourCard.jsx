import ButtonText from "./ButtonText";
import TourDetails from "./TourDetails";

export default function FlipCard({ tour }) {
  return (
    <div className="relative w-80 md:w-96 p-4 mx-auto group">
      {/* ✅ MOBILE: Show as a static simple card */}
      <div className="block md:hidden rounded-xl overflow-hidden shadow-xl bg-white text-center">
        <div className="relative h-48 w-full overflow-hidden">
          {/* Imagen con degradado */}
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage:
                "var(--gradient-overlay), url(" + tour.imageUrl + ")",
            }}
          />

          {/* Header sobre la imagen */}
          <h4 className="card__heading absolute top-28 right-2 w-3/4 text-right text-white uppercase font-light text-xl">
            <span
              className="box-decoration-break-clone px-1 py-1 rounded-md text-white"
              style={{
                backgroundImage: "var(--gradient-heading)",
              }}
            >
              {tour.name}
            </span>
          </h4>
        </div>

        <div className="p-4">
          <TourDetails tour={tour} />
          <ButtonText
            href={`/booking/${tour.slug}`}
            className="bg-[var(--color-primary-light)] text-[var(--color-grey-dark-3)]"
          >
            Book now
          </ButtonText>
        </div>
      </div>

      {/* ✅ DESKTOP: Flip Card */}
      <div className="hidden md:block text-center relative h-[90vh] [perspective:150rem]">
        {/* Card Inner */}
        <div
          className="
            relative w-full h-full transition-transform duration-700
            [transform-style:preserve-3d]
            group-hover:[transform:rotateY(180deg)]
          "
        >
          {/* Front Side */}
          <div
            className="absolute top-0 left-0 w-full h-full rounded-xl overflow-hidden shadow-xl bg-white [backface-visibility:hidden]
  "
          >
            <div className="relative h-[13rem] w-full overflow-hidden">
              {/* Imagen con degradado */}
              <div
                className="h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "var(--gradient-overlay), url(" + tour.imageUrl + ")",
                }}
              />

              {/* Header sobre la imagen */}
              <h4 className="card__heading absolute top-28 right-2 w-3/4 text-right text-white uppercase font-light text-2xl">
                <span
                  className="box-decoration-break-clone px-1 py-1 rounded-md text-white"
                  style={{
                    backgroundImage: "var(--gradient-heading)",
                  }}
                >
                  {tour.name}
                </span>
              </h4>
            </div>

            <div className="p-4 bg-white">
              <TourDetails tour={tour} />
            </div>
          </div>

          {/* Back Side */}
          <div
            className="
              absolute top-0 left-0 w-full h-full
              rounded-xl overflow-hidden shadow-xl
              bg-gradient-to-br from-[var(--color-secondary-dark)] to-[var(--color-tertiary-dark)] text-white
              flex flex-col items-center justify-center
              text-center
              [backface-visibility:hidden]
              [transform:rotateY(180deg)]
            "
          >
            <p className="text-3xl font-bold mb-2">${tour.price}</p>
            <ButtonText
              href={`/booking/${tour.slug}`}
              className="bg-[var(--color-secondary-dark)] text-[var(--color-grey-dark-3)] "
            >
              Book now
            </ButtonText>
          </div>
        </div>
      </div>
    </div>
  );
}
