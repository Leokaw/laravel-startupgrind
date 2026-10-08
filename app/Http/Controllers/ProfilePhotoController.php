<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfilePhotoController extends Controller
{
   public function store(Request $request): RedirectResponse
{
    $request->validate([
        'photo' => [
            'required',
            'image',
            'mimes:jpg,jpeg,png,webp',
            'max:2048',                             // 2 MB
            'dimensions:min_width=100,min_height=100',
        ],
    ]);

    $user = $request->user();

    if ($user->profile_photo_path) {
        Storage::disk('public')->delete($user->profile_photo_path);
    }

    $path = $request->file('photo')->store('profile-photos', 'public');

    $user->forceFill(['profile_photo_path' => $path])->save();

    return redirect()->back()->with('success', 'Profile photo updated.');
}

    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
            $user->forceFill(['profile_photo_path' => null])->save();
        }

        return redirect()->back()->with('success', 'Profile photo removed.');
    }
}