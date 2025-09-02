"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { FaRegImage } from "react-icons/fa6";
import { ProductForm } from "@/types/ProductForm";
import InputField from "../../components/InputField";
import { TbSelect, TbTrash } from "react-icons/tb";

const AddProductPage: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    category: "",
    technical: "",
    unitPrice: "",
    stock: "",
    isCustomOrder: false,
    necessaryDays: "",
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [photoIds, setPhotoIds] = useState<string[]>([]);

  const handleInputChange = (
    field: keyof ProductForm,
    value: string | boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      setPhotos((prev) => [...prev, ...newPhotos].slice(0, 5));
    }
  };

  const handlePhotoSelect = (index: number) => {
    setSelectedPhotos((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const removeSelectedPhotos = () => {
    setPhotos((prev) =>
      prev.filter((_, index) => !selectedPhotos.includes(index))
    );
    setSelectedPhotos([]);
  };

  const triggerFileUpload = () => {
    document.getElementById("photo-upload")?.click();
  };

  const handleImage = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = fetch("https://verbose-space-dollop-jwg7vpv9v64fq9x9-3333.app.github.dev/attachments", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    return res;
  };

  useEffect(() => {
    const uploadPhotos = async () => {
      const uploadedPhotoIds: string[] = [];
      for (const photo of photos) {
        try {
          const response = await handleImage(photo);
          const result = await response.json();
          uploadedPhotoIds.push(result.attachmentId);
          console.log("Uploaded photo ID:", result.attachmentId);
        } catch (error) {
          console.error("Erro ao fazer upload da foto:", error);
        }
      }
      setPhotoIds(uploadedPhotoIds);
    };

    if (photos.length > 0) {
      uploadPhotos();
    } else {
      setPhotoIds([]);
    }
  }, [photos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.unitPrice ||
      !form.category ||
      !form.stock
    ) {
      console.error("Todos os campos obrigatórios devem ser preenchidos");
      return;
    }

    const productData = {
      title: form.name.trim(),
      description: form.description.trim(),
      priceInCents: Math.round(parseFloat(form.unitPrice) * 100),
      categoryId: parseInt(form.category),
      stock: parseInt(form.stock),
      photoIds: photoIds,
      technique: form.technical.trim(),
      isCustomOrder: form.isCustomOrder,
      necessaryDays: form.isCustomOrder ? parseInt(form.necessaryDays) || 0 : 0,
    };

    console.log("Form submitted:", productData);
    console.log("Photos:", photos);

    try {
      const res = await fetch("https://verbose-space-dollop-jwg7vpv9v64fq9x9-3333.app.github.dev/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
        credentials: "include",
      });

      if (res.ok) {
        console.log("Produto adicionado com sucesso!");
        router.back();
      } else {
        const errorData = await res.json();
        console.error("Erro ao adicionar produto:", errorData);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const PhotoSlot: React.FC<{
    index: number;
    photo?: File;
    onClick: () => void;
    isSelected: boolean;
  }> = ({ index, photo, onClick, isSelected }) => (
    <div
      className={`${
        index === 0
          ? "col-span-2 row-span-2 w-full h-44"
          : "col-span-1 row-span-1 w-full h-20"
      } border-2 rounded-lg cursor-pointer transition-all flex items-center justify-center
        ${
          photo
            ? "border-gray-300 bg-gray-50"
            : "border-sakura bg-white hover:bg-gray-50"
        }
        ${isSelected ? "ring-2 ring-red-400 border-red-400" : ""}
      `}
      onClick={onClick}
    >
      {photo ? (
        <div className="w-full h-full rounded-lg overflow-hidden">
          <img
            src={URL.createObjectURL(photo)}
            alt={`Preview ${index}`}
            className="w-full h-full"
          />
          {isSelected && (
            <div className="bg-red-400 bg-opacity-20 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-salmon rounded-full"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {index === 0 ? (
            <Upload className="w-6 h-6 text-sakura " />
          ) : (
            <FaRegImage className="w-6 h-6 text-sakura" />
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#A6E3E9] text-midnight">
      <Header />

      <div className="w-8/12 mx-auto pt-10">
        <div className="flex items-center mb-6">
          <ArrowLeft
            className="w-6 h-6 text-gray-700 mr-3 cursor-pointer hover:text-gray-900"
            onClick={handleBack}
          />
          <h1 className="text-xl font-bold text-gray-800">Adicionar produto</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-bold text-salmon mb-6">
                  Informações
                </h2>

                <div className="space-y-4">
                  <div>
                    <InputField
                      label="Nome do Produto"
                      type="text"
                      value={form.name}
                      onChange={(value) => handleInputChange("name", value)}
                      placeholder="Digite o nome do produto"
                      required={true}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Descrição *
                    </label>
                    <textarea
                      required
                      value={form.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sakura focus:border-transparent outline-none transition-all"
                      placeholder="Digite a descrição do produto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Categoria *
                    </label>
                    <select
                      required
                      value={form.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sakura focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Selecione uma categoria</option>
                      <option value="1">Cerâmica</option>
                      <option value="2">Madeira</option>
                      <option value="3">Tecido</option>
                      <option value="4">Metal</option>
                      <option value="5">Outros</option>
                    </select>
                  </div>

                  <div>
                    <InputField
                      label="Técnica"
                      type="text"
                      value={form.technical}
                      onChange={(value) =>
                        handleInputChange("technical", value)
                      }
                      placeholder="Digite a técnica utilizada"
                    />
                  </div>

                  <div>
                    <div className="flex items-center mb-2 text-salmon font-bold">
                      <span>Preço e Estoque</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-1 flex-row items-center space-x-2 ">
                        <div className="col-span-1">
                          <InputField
                            label="Preço Unitário"
                            type="number"
                            required={true}
                            min="0"
                            step="0.01"
                            value={form.unitPrice}
                            onChange={(value) =>
                              handleInputChange("unitPrice", value)
                            }
                            placeholder="0,00"
                          />

                          <InputField
                            label="Estoque"
                            type="number"
                            required={true}
                            min="0"
                            value={form.stock}
                            onChange={(value) =>
                              handleInputChange("stock", value)
                            }
                            placeholder="Quantidade"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col space-x-2 text-sm ring-2 ring-sakura p-5 col-span-1 font-bold rounded-2xl">
                        <span>Produto sob encomenda?</span>
                        <div className="flex gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm">
                            <input
                              type="radio"
                              name="isCustomOrder"
                              value="true"
                              checked={form.isCustomOrder === true}
                              onChange={() =>
                                handleInputChange("isCustomOrder", true)
                              }
                              className="w-5 h-5 accent-sakura"
                            />
                            <label>Sim</label>
                          </div>

                          <div className="flex items-center gap-1 text-sm">
                            <input
                              type="radio"
                              name="isCustomOrder"
                              value="false"
                              checked={form.isCustomOrder === false}
                              onChange={() =>
                                handleInputChange("isCustomOrder", false)
                              }
                              className="w-5 h-5 accent-sakura"
                            />
                            <label>Não</label>
                          </div>
                        </div>
                        <div className="mt-2">
                          <InputField
                            label="Dias Necessários"
                            type="number"
                            min="0"
                            value={form.necessaryDays}
                            onChange={(value) =>
                              handleInputChange("necessaryDays", value)
                            }
                            placeholder="Quantidade de dias"
                            disabled={!form.isCustomOrder}
                            className="w-6/12"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-salmon">
                      Mídias
                    </h2>
                    <h3 className="text-sm text-midnight font-bold">Foto(s)</h3>
                  </div>
                  {selectedPhotos.length > 0 && (
                    <button
                      type="button"
                      onClick={removeSelectedPhotos}
                      className="flex items-center space-x-1 text-salmon hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">
                        Remover ({selectedPhotos.length})
                      </span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 grid-rows-2 gap-3 mb-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <PhotoSlot
                      key={index}
                      index={index}
                      photo={photos[index]}
                      onClick={() => {
                        if (photos[index]) {
                          handlePhotoSelect(index);
                        } else {
                          document.getElementById("photo-upload")?.click();
                        }
                      }}
                      isSelected={selectedPhotos.includes(index)}
                    />
                  ))}
                </div>

                <input
                  id="photo-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <p className="text-sm text-gray-500 mb-4">
                  Adicione até 5 fotos do seu produto. Clique nos quadrados para
                  adicionar ou selecionar fotos.
                </p>

                <div className="flex mb-1 text-xs font-semibold">
                  <button
                    type="button"
                    className="p-2 w-full bg-olivine text-white rounded-lg hover:bg-green-600 transition-all"
                    onClick={triggerFileUpload}
                    disabled={photos.length >= 5}
                  >
                    + Adicionar Foto (Maximo 5)
                  </button>
                </div>

                <div className="flex mb-10 text-xs space-x-2 font-semibold">
                  <button
                    type="button"
                    className="flex px-2 py-2 justify-center items-center w-full border-2 border-sakura ring-sakura text-sakura rounded-lg hover:bg-sakura hover:text-white transition-all"
                    onClick={() =>
                      setSelectedPhotos(photos.map((_, index) => index))
                    }
                    disabled={photos.length === 0}
                  >
                    <TbSelect />
                    Selecionar Fotos
                  </button>

                  <button
                    type="button"
                    className="flex px-2 py-2 justify-center items-center w-full bg-sakura text-white rounded-lg hover:bg-salmon transition-all"
                    onClick={removeSelectedPhotos}
                  >
                    <TbTrash />
                    Remover Fotos Selecionadas
                  </button>
                </div>

                <div className="flex justify-end text-sm space-x-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#2AAA4C] text-white rounded-lg hover:bg-green-600 transition-all"
                  >
                    Adicionar Produto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer newsSubscription={false} />
    </div>
  );
};

export default AddProductPage;
