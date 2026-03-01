import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

type FooterComponentProps = {
  isDarkMode: boolean;
  isLoading: boolean;
};

const FooterComponent = ({ isDarkMode, isLoading }: FooterComponentProps) => {
  return (
    <footer className="mt-8 text-center mb-14 sm:mb-0">
      <p>
        Utvecklad med ❤️ av{' '}
        <a
          href="https://marcuslindholm.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Marcus Lindholm {!isLoading && <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="sm" />}
        </a>
      </p>
      <a
        href="https://app.swish.nu/1/p/sw/?sw=0736426599&msg=Tack!&edit=msg&src=qr"
        className="flex items-center justify-center mt-4 mb-4 text-xs"
      >
        Vill du stödja denna sida? Donera en slant!
        <Image
          src={isDarkMode ? '/Swish_dark.png' : '/Swish_light.png'}
          alt="Swish Logo"
          width={25}
          height={25}
          className="ml-2 object-contain"
        />
      </a>
      <p className="text-xs text-gray-500 top-0 right-0 mt-2 mr-2">
        APKrona.se uppdateras i regel en gång per dag. Eget ansvar gäller vid konsumption av alkohol. APKrona.se tar inget
        ansvar för hur webbplatsen brukas. Buggar förekommer. APKrona.se bör endast ses som en kul grej, inget annat.
        Kul att du hittade hit!
      </p>
    </footer>
  );
};

export default FooterComponent;