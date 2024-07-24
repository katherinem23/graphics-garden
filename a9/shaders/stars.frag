#version 330 core

uniform vec2 iResolution;
uniform float iTime;
uniform int iFrame;

uniform sampler2D tex_sky; 

in vec3 vtx_pos; // [-1, 1]
in vec2 vtx_uv; // [0, 1]

out vec4 frag_color;

#define NUM_STAR 1.

// return random vec2 between 0 and 1
vec2 hash2d(float t)
{
    t += 1.;
    float x = fract(sin(t * 674.3) * 453.2);
    float y = fract(sin((t + x) * 714.3) * 263.2);

    return vec2(x, y);
}

vec3 renderParticle(vec2 uv, vec2 pos, float brightness, vec3 color)
{
    float d = length(uv - pos);
    // make beams of light
    // vec3 return_val = vec3(0,0,0);
    // if (mod(2, floor(atan((uv.y-pos.y)/(uv.x - pos.x)))) != 0) {
    //     return_val = brightness / d * color;
    // }
    // return return_val;

    return brightness / d * color;
}

vec3 renderStars(vec2 uv)
{
    vec3 fragColor = vec3(0.0);

    float t = iTime;
    for(float i = 0.; i < NUM_STAR; i++)
    {
        vec2 pos = vec2(0,0); // map to [-1, 1]
        float brightness = .5;
        //brightness *= sin(1.5 * t + i) * .5 + .5; // flicker
        vec3 color = vec3(0.95, 0.75, 0.15);

        fragColor += renderParticle(uv, pos, brightness, color);
    }

    return fragColor;
}

void main()
{
    vec3 brightColor = renderStars(vtx_pos.xy);

    vec2 uv = vec2(vtx_uv.x, -vtx_uv.y);
    vec3 darkColor = texture(tex_sky, uv).xyz;
    //vec3 darkColor = vec3(0.1,0.1,0.1);

    frag_color = vec4(mix(darkColor, brightColor, (sin(iTime/5) + 2) * 0.04), 1.0);
}