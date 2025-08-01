"use client";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

import productData from "./productData.json";

interface HealthBenefit {
  title: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  healthBenefits: HealthBenefit[];
}

const ProductShowcase = () => {
  const [nextIndex, setNextIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const products = productData.products;
  const currentProduct = products[currentIndex];

  const nextProduct = () => {
    if (isTransitioning) return;
    const newIndex = (currentIndex + 1) % products.length;
    setNextIndex(newIndex);
    setDirection(1); // Forward direction
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 500);
  };

  const prevProduct = () => {
    if (isTransitioning) return;
    const newIndex = (currentIndex - 1 + products.length) % products.length;
    setNextIndex(newIndex);
    setDirection(-1); // Backward direction
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 500);
  };

  const goToProduct = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setNextIndex(index);
    setDirection(index > currentIndex ? 1 : -1); // Set direction based on index difference
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 500);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextProduct();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        prevProduct();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isTransitioning]);

  const ProductContent = ({ product }: { product: Product }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Product Information - Left Side */}
      <div className="space-y-4">
        <h3 className="text-3xl font-bold text-green-800">{product.name}</h3>
        <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block">
          {product.category}
        </span>
        <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
        <span className="text-3xl font-bold text-green-800 block">${product.price}</span>
      </div>

      {/* Product Image - Center */}
      <div className="flex justify-center">
        <div className="aspect-square flex items-center justify-center w-full max-w-xl transform transition-transform duration-700 hover:scale-105">
          <Image
            src={product.image}
            alt={product.name}
            width={384}
            height={384}
            className="w-96 h-96 object-contain"
            priority
          />
        </div>
      </div>

      {/* Health Benefits - Right Side */}
      <div className="space-y-6">
        {product.healthBenefits.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-green-800 mb-2">{benefit.title}</h4>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen">
      <style jsx global>{`
        @keyframes slideUpFromBottom {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideDownFromTop {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideUpAndFade {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        @keyframes slideDownAndFade {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        @keyframes slideOutLeft {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-200%);
            opacity: 0;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-200%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(200%);
            opacity: 0;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(200%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-800 mb-4">Discover Our Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the power of natural ingredients with our carefully crafted products
          </p>
        </div>

        <div ref={containerRef} className="max-w-7xl mx-auto relative">
          <div className="relative overflow-hidden min-h-[600px]">
            {/* Current Product */}
            <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Content */}
              <div
                className="space-y-4 transition-all duration-500 ease-in-out"
                style={{
                  animation: isTransitioning ? "slideOutLeft 0.5s ease-in-out forwards" : undefined
                }}
              >
                <h3 className="text-3xl font-bold text-green-800">{currentProduct.name}</h3>
                <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block">
                  {currentProduct.category}
                </span>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {currentProduct.description}
                </p>
                <span className="text-3xl font-bold text-green-800 block">
                  ${currentProduct.price}
                </span>
              </div>

              {/* Center Image */}
              <div
                className="flex justify-center transition-all duration-500 ease-in-out"
                style={{
                  animation: isTransitioning
                    ? direction === 1
                      ? "slideUpAndFade 0.5s ease-in-out forwards"
                      : "slideDownAndFade 0.5s ease-in-out forwards"
                    : undefined
                }}
              >
                <div className="aspect-square flex items-center justify-center w-full max-w-xl transform hover:scale-105">
                  <Image
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    width={384}
                    height={384}
                    className="w-96 h-96 object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Right Content */}
              <div
                className="space-y-6 transition-all duration-500 ease-in-out"
                style={{
                  animation: isTransitioning ? "slideOutRight 0.5s ease-in-out forwards" : undefined
                }}
              >
                {currentProduct.healthBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-green-800 mb-2">{benefit.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Incoming Product */}
            {isTransitioning && (
              <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Content */}
                <div
                  className="space-y-4"
                  style={{
                    animation: "slideInLeft 0.5s ease-in-out forwards"
                  }}
                >
                  <h3 className="text-3xl font-bold text-green-800">{products[nextIndex].name}</h3>
                  <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block">
                    {products[nextIndex].category}
                  </span>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {products[nextIndex].description}
                  </p>
                  <span className="text-3xl font-bold text-green-800 block">
                    ${products[nextIndex].price}
                  </span>
                </div>

                {/* Center Image */}
                <div
                  className="flex justify-center"
                  style={{
                    animation: `${
                      direction === 1 ? "slideUpFromBottom" : "slideDownFromTop"
                    } 0.5s ease-in-out forwards`
                  }}
                >
                  <div className="aspect-square flex items-center justify-center w-full max-w-xl transform hover:scale-105">
                    <Image
                      src={products[nextIndex].image}
                      alt={products[nextIndex].name}
                      width={384}
                      height={384}
                      className="w-96 h-96 object-contain"
                      priority
                    />
                  </div>
                </div>

                {/* Right Content */}
                <div
                  className="space-y-6"
                  style={{
                    animation: "slideInRight 0.5s ease-in-out forwards"
                  }}
                >
                  {products[nextIndex].healthBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-green-800 mb-2">
                          {benefit.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={prevProduct}
              disabled={isTransitioning}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex space-x-2">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToProduct(index)}
                  disabled={isTransitioning}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 disabled:cursor-not-allowed ${
                    index === currentIndex ? "bg-green-600" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextProduct}
              disabled={isTransitioning}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Instructions */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Use arrow keys or click the navigation buttons to explore our products
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
