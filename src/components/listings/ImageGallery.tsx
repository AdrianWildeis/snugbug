'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  title: string;
  noImagesText: string;
}

export function ImageGallery({ images, title, noImagesText }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (images.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100">
        <p className="text-gray-400">{noImagesText}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {/* Main Image */}
      <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={images[selectedImage]}
          alt={title}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-all ${
                selectedImage === index ? 'ring-2 ring-primary-600 ring-offset-2' : ''
              }`}
            >
              <Image
                src={image}
                alt={`${title} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
