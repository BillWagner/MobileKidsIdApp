﻿/// <reference path="../Definitions/angular.d.ts" />
/// <reference path="../Services/UserService.ts" />
/// <reference path="../Definitions/angular-ui-router.d.ts" />
/// <reference path="../models/models.ts" />

module MCM {
    export class BasicDetailsController {

        //private _scope: any;
        private _state: angular.ui.IStateService;
        private _ionicPopup: ionic.popup.IonicPopupService;
        private _childDataService: MCM.ChildDataService;

        public static $inject = ['$scope', '$state', '$stateParams', '$ionicPopup', 'childDataService'];

        constructor($scope: ng.IScope, $state: angular.ui.IStateService, $stateParams: any,
                $ionicPopup: ionic.popup.IonicPopupService, childDataService: MCM.ChildDataService) {
            //this._scope = $scope;
            this._state = $state;
            this._ionicPopup = $ionicPopup;
            let childId = $stateParams.childId;
            childDataService.getById(childId).then(child => {
                child = child === null ? <Child>{ id: childId } : angular.copy(child);
                this.doDatePickerSetup(child.childDetails.birthday || new Date());
                this.child = child;
            });
            this._childDataService = childDataService;
            this.doDatePickerSetup(null);
        }
        
        public child: Child;
        public datepickerObject;

        public checkChildHasChanges(editedChild: Child, originalChild: Child): boolean {
            if ((originalChild == null) != (editedChild == null)) return true;
            return !angular.equals(originalChild.childDetails, editedChild.childDetails);
        }

        public NavigateToPreviousView() {
            let hasChangesPromise = this._childDataService.get(this.child)
                    .then(chld => this.checkChildHasChanges(this.child, chld));
            
            hasChangesPromise.then(hasChanges => {
                let go = () => this._state.go("childProfileItem", { childId: this.child.id });
                if (hasChanges) {
                    this._ionicPopup.confirm({
                        title: 'Confirm Leave Page',
                        template: 'There are unsaved changes. Ignore changes and leave?'
                    }).then(answer => {
                        if (answer) { go(); }
                    });
                } else {
                    go();
                }
            });
        }

        public saveChanges(formValid: boolean) {
            if (formValid) {
                this._childDataService.update(this.child);
            }
        }

        private doDatePickerSetup(defaultDate: Date) {
            //See this page for available options: https://github.com/rajeshwarpatlolla/ionic-datepicker
            this.datepickerObject = {
                titleLabel: 'Select Date of Birth',
                inputDate: defaultDate,
                templateType: 'popup',
                to: new Date(),
                callback: (newDate => { this.child.birthday = newDate; }).bind(this),
            };
        }
        
    }
}

angular.module('mcmapp').controller('basicDetailsController', MCM.BasicDetailsController);