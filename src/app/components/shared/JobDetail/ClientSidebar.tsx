import { Button } from "@/app/components/ui/button";
import { Icon } from "@iconify/react";

const ClientSidebar = () => {
  const filledStars = 4;
  const totalStars = 5;

  return (
    <div className="w-full  max-w-[312px] space-y-2">
      {/* Client Card */}
      <div className="flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
          alt="Client"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">Nom du Client</h3>
          <p className="text-sm text-gray-500">Localisation</p>
        </div>
        <button className="text-orange-500 hover:text-orange-600 transition-colors">
          <Icon icon={"bi:heart"} className="w-5 h-5 fill-current" />
        </button>
      </div>

      {/* Message Section */}
      <div className="border-t border-border">
        <h4 className="font-semibold text-gray-800 mb-3">
          Message ou instruction
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          un Message ou une description Message description Message description
          Message description un Message ou une description Message description
          Message description Message description Message description un Messa.
        </p>
      </div>

      {/* Images Section */}
      <div className="border-t border-border pt-4">
        <h4 className="font-semibold text-gray-800 mb-3">
          {"Images liées à l'offre"}
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop"
            alt="Offre 1"
            className="w-full h-24 object-cover rounded-lg"
          />
          <img
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&h=150&fit=crop"
            alt="Offre 2"
            className="w-full h-24 object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Communication Button */}
      <Button
        variant="outline"
        className="w-full bg-transparent border-blue-900 text-blue-900 hover:bg-transparent rounded-full"
      >
        <Icon icon={"bi:message"} className="w-4 h-4 mr-2" />
        Communiquer avec le client
      </Button>

      {/* Rating Section */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-semibold text-gray-800 mb-3">Note actuelle</h4>
        <div className="flex gap-1">
          {[...Array(totalStars)].map((_, i) => (
            <Icon
              icon={"bx:star"}
              key={i}
              className={`w-6 h-6 ${
                i < filledStars
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Observations Section */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-semibold text-gray-800 mb-3">
          Observations du client
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          un Message ou une description Message description Message description
          Message description un Message ou une description Message description
          Message description Message description Message description un Messa.
        </p>
      </div>
    </div>
  );
};

export default ClientSidebar;
