import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public homeRoute = new Subject();
  public lensHomeRoute = new Subject();
  public lensEvent = new Subject();
  public ProfilePictureEvent = new Subject();
  public ISevent = new Subject();
  public settingsEvent = new Subject();
  public LoginProfilePictureEvent = new Subject();
  public intentsData = new Subject();
  public entitiesData = new Subject();
  public desktopNotificationEvent =new Subject()
  public lensProfilePictureEvent=new Subject()
  public lensPictureEvent=new Subject()
  public backEvent=new Subject()
  public orgPictureEvent=new Subject()
  constructor() {}

  setLensEvent(event: any) {
    this.lensEvent.next(event);
  }

  setISEvent(event: any) {
    this.ISevent.next(event);
  }
  setProfilePictureEvent(event: any) {
    this.ProfilePictureEvent.next(event);
  }
  setOrgPictureEvent(event:any){
this.orgPictureEvent.next(event)
  }

  setHomeRoute(route: any) {
    this.homeRoute.next(route);
  }
  setLensHomeRoute(route: any) {
    this.lensHomeRoute.next(route);
  }
  setIntentsData(route: any){
    this.intentsData.next(route);
  }
  setEntitiesData(route:any){
    this.entitiesData.next(route)
  }
  setDesktopNotificationEvent(route:any){
    this.desktopNotificationEvent.next(route)
  }
  setLensProfilePictureEvent(route:any){
    this.lensProfilePictureEvent.next(route)
  }
  setLensPictureEvent(route:any){
    this.lensPictureEvent.next(route)
  }
  setBackEvent(route:any){
    this.backEvent.next(route)
  }
  getLensEvent(): Observable<any> {
    return this.lensEvent.asObservable();
  }
  getProfilePictureEvent(): Observable<any> {
    return this.ProfilePictureEvent.asObservable();
  }
  getOrgPictureEvent(): Observable<any> {
    return this.orgPictureEvent.asObservable();
  }
  getISEvent(): Observable<any> {
    return this.ISevent.asObservable();
  }

  getHomeRoute(): Observable<any> {
    return this.homeRoute.asObservable();
  }

  getLensHomeRoute(): Observable<any> {
    return this.lensHomeRoute.asObservable();
  }
  getIntentsData() : Observable<any>{
    return this.intentsData.asObservable();
  }
  getEntitiesData() :Observable<any>{
    return this.entitiesData.asObservable();
  }
  getDesktopNotificationEvent() :Observable<any>{
    return this.desktopNotificationEvent.asObservable();
  }
  getLensProfilePictureEvent() :Observable<any>{
    return this.lensProfilePictureEvent.asObservable();
  }
  getLensPictureEvent() :Observable<any>{
    return this.lensPictureEvent.asObservable();
  }
  getBackEvent():Observable<any>{
    return this.backEvent.asObservable();
  }
}
