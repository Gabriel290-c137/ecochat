import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserPhoto } from '../interfaces/photo.interface';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];

  constructor() {}

  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100
    });

    this.photos.unshift({
      filepath: "local-photo.jpg",
      webviewPath: `data:image/jpeg;base64,${capturedPhoto.base64String}`,
      base64: capturedPhoto.base64String
    });
  }
}
