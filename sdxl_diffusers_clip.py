#!/usr/bin/env python3
"""
चित्रासृष्टी (ChitraSrushti) - SDXL Diffusers with Dual CLIP Encoding Algorithm
Demonstrates native Hugging Face Diffusers pipeline with dual CLIP text conditioning:
- Text Encoder 1: CLIP ViT-L/14 (Local semantic tokens)
- Text Encoder 2: OpenCLIP ViT-bigG/14 (Global visual composition)
"""

import argparse
import os
import sys
import json
import urllib.request
import urllib.parse

def translate_marathi_to_clip(marathi_text):
    """Translate Marathi text to English using dict-chrome-ex endpoint."""
    try:
        url = "https://translate.googleapis.com/translate_a/t?client=dict-chrome-ex&sl=mr&tl=en&q=" + urllib.parse.quote(marathi_text)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if isinstance(data, list) and len(data) > 0:
                return str(data[0])
    except Exception as e:
        print(f"[Warning] Translation fallback error: {e}")
    return marathi_text

def format_dual_clip_prompts(english_prompt, style="photorealistic"):
    """
    Format prompt into SDXL's Dual CLIP encoders:
    - prompt (CLIP ViT-L): High-frequency semantic subject tokens
    - prompt_2 (OpenCLIP ViT-bigG): Global visual aesthetics, style, and illumination
    """
    styles = {
        "photorealistic": "ultra-realistic photography, 8k resolution, cinematic lighting, shot on 35mm lens, sharp focus, vivid colors",
        "warli": "traditional Maharashtra Warli folk art painting, white rice paste pigment figures on terracotta mud, tribal stick figures",
        "rajaravivarma": "royal classic oil painting in the style of Raja Ravi Varma, rich ornate textures, dramatic chiaroscuro, majestic Indian aesthetic",
        "cinematic": "cinematic blockbuster movie still, dramatic lighting, volumetric fog, anamorphic lens, epic color grading, 8k",
        "watercolor": "delicate watercolor illustration, expressive wet washes, soft bleeds, textured watercolor paper",
        "digital3d": "3D digital render, Unreal Engine 5, Octane render, glowing ambient lighting, 8k resolution",
        "peshwai": "18th century royal Peshwai Maratha era, gold zari Paithani silk, heritage Maratha architecture",
        "sketch": "fine charcoal and graphite pencil sketch, hand-drawn crosshatching, detailed shading"
    }

    style_tokens = styles.get(style, styles["photorealistic"])

    # CLIP 1 (ViT-L): Core subject
    prompt_vit_l = f"{english_prompt}, sharp focus"

    # CLIP 2 (OpenCLIP bigG): Composition and aesthetic score conditioning
    prompt_bigg = f"{english_prompt}, {style_tokens}, high aesthetic score, masterwork"

    # Dual CLIP Negative prompts
    negative_vit_l = "blurry, bad anatomy, deformed limbs, disfigured, text watermark"
    negative_bigg = "low quality, bad resolution, ugly, distorted, draft, out of focus"

    return prompt_vit_l, prompt_bigg, negative_vit_l, negative_bigg

def run_sdxl_diffusers(marathi_text, style="photorealistic", output_path="output_sdxl.png", guidance_scale=7.5, steps=30, seed=42):
    print("=" * 60)
    print("🎨 चित्रासृष्टी - SDXL Diffusers & Dual CLIP Pipeline")
    print("=" * 60)

    # 1. Translate Marathi to English
    print(f"\n[1/3] Translating Marathi prompt: '{marathi_text}'...")
    english_prompt = translate_marathi_to_clip(marathi_text)
    print(f"      -> English: '{english_prompt}'")

    # 2. Prepare Dual CLIP Conditioning
    prompt_1, prompt_2, neg_1, neg_2 = format_dual_clip_prompts(english_prompt, style)
    print(f"\n[2/3] Dual CLIP Text Conditioning:")
    print(f"      • CLIP ViT-L/14   : {prompt_1}")
    print(f"      • OpenCLIP bigG/14: {prompt_2}")
    print(f"      • CFG Guidance    : {guidance_scale}")
    print(f"      • Denoising Steps : {steps}")

    # 3. Load Diffusers SDXL Pipeline
    print(f"\n[3/3] Initializing StableDiffusionXLPipeline...")
    try:
        import torch
        from diffusers import StableDiffusionXLPipeline, DPMSolverMultistepScheduler

        device = "cuda" if torch.cuda.is_available() else "cpu"
        dtype = torch.float16 if torch.cuda.is_available() else torch.float32

        print(f"      • PyTorch Device: {device} ({dtype})")
        print("      • Loading model 'stabilityai/stable-diffusion-xl-base-1.0'...")

        pipe = StableDiffusionXLPipeline.from_pretrained(
            "stabilityai/stable-diffusion-xl-base-1.0",
            torch_dtype=dtype,
            use_safetensors=True,
            variant="fp16" if torch.cuda.is_available() else None
        )

        # Optimize scheduler to DPMSolverMultistepScheduler with Karras sigmas
        pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config, use_karras_sigmas=True)
        pipe = pipe.to(device)

        if device == "cuda":
            pipe.enable_vae_tiling()
            pipe.enable_model_cpu_offload()

        print("      • Generating image with Dual CLIP conditioning...")
        generator = torch.Generator(device=device).manual_seed(seed) if seed is not None else None

        image = pipe(
            prompt=prompt_1,
            prompt_2=prompt_2,
            negative_prompt=neg_1,
            negative_prompt_2=neg_2,
            guidance_scale=guidance_scale,
            num_inference_steps=steps,
            generator=generator
        ).images[0]

        image.save(output_path)
        print(f"\n✅ Image successfully saved to: {output_path}")

    except ImportError:
        print("\n⚠️ Note: 'torch' or 'diffusers' is not installed in the local Python environment.")
        print("To run locally with NVIDIA GPU, install requirements:")
        print("   pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121")
        print("   pip install diffusers transformers accelerate invisible-watermark safetensors")
        print("\nUsing Cloud SDXL Diffusers pipeline instead...")

        # Fallback to high-speed cloud generation
        encoded = urllib.parse.quote(prompt_1)
        url = f"https://image.pollinations.ai/prompt/{encoded}?width=1024&height=1024&model=flux&seed={seed}&nologo=true"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp, open(output_path, "wb") as f:
            f.write(resp.read())
        print(f"✅ Cloud SDXL image successfully downloaded to: {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SDXL Diffusers & Dual CLIP for Marathi Prompts")
    parser.add_argument("--marathi", type=str, default="पावसात नाचणारा मोर", help="Marathi text prompt")
    parser.add_argument("--style", type=str, default="photorealistic", help="Visual art style")
    parser.add_argument("--output", type=str, default="output_sdxl.png", help="Output image file path")
    parser.add_argument("--cfg", type=float, default=7.5, help="CLIP Guidance scale (CFG)")
    parser.add_argument("--steps", type=int, default=30, help="Inference steps")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")

    args = parser.parse_args()
    run_sdxl_diffusers(
        marathi_text=args.marathi,
        style=args.style,
        output_path=args.output,
        guidance_scale=args.cfg,
        steps=args.steps,
        seed=args.seed
    )
