import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ChecklistOnboardingWebPartStrings';
import Tarefas from './components/Tarefas';
import { ITarefasProps } from './components/ITarefasProps';
import PrimeiroDia from './components/PrimeiroDia';
import { IPrimeiroDiaProps } from './components/IPrimeiroDiaProps';
import PrimeiraSemana from './components/PrimeiraSemana';
import { IPrimeiraSemanaProps } from './components/IPrimeiraSemanaProps';
import PrimeiroMes from './components/PrimeiroMes';
import { IPrimeiroMesProps } from './components/IPrimeiroMesProps';
import Dashboard from './components/Dashboard';
import { IDashboardProps } from './components/IDashboardProps';
import { LocalStorageService } from './services/LocalStorageService';
import { IStorageService } from './services/IStorageService';

export interface IChecklistOnboardingWebPartProps {
  description: string;
}

type CurrentView = 'tarefas' | 'primeiroDia' | 'primeiraSemana' | 'primeiroMes' | 'dashboard';

export default class ChecklistOnboardingWebPart extends BaseClientSideWebPart<IChecklistOnboardingWebPartProps> {

  private _currentView: CurrentView = 'tarefas';
  private _storageService: IStorageService = new LocalStorageService();

  public render(): void {
    let element: React.ReactElement;

    switch (this._currentView) {
      case 'tarefas':
        element = React.createElement<ITarefasProps>(
          Tarefas,
          {
            onSelectStage: (stage: string) => {
              this._currentView = stage as CurrentView;
              this.render();
            },
            onVoltar: undefined, // Não precisa voltar, pois este WebPart é independente
            storageService: this._storageService
          }
        );
        break;

      case 'primeiroDia':
        element = React.createElement<IPrimeiroDiaProps>(
          PrimeiroDia,
          {
            onVoltar: () => {
              this._currentView = 'tarefas';
              this.render();
            },
            storageService: this._storageService
          }
        );
        break;

      case 'primeiraSemana':
        element = React.createElement<IPrimeiraSemanaProps>(
          PrimeiraSemana,
          {
            onVoltar: () => {
              this._currentView = 'tarefas';
              this.render();
            },
            storageService: this._storageService
          }
        );
        break;

      case 'primeiroMes':
        element = React.createElement<IPrimeiroMesProps>(
          PrimeiroMes,
          {
            onVoltar: () => {
              this._currentView = 'tarefas';
              this.render();
            },
            storageService: this._storageService
          }
        );
        break;

      case 'dashboard':
        element = React.createElement<IDashboardProps>(
          Dashboard,
          {
            onVoltar: () => {
              this._currentView = 'tarefas';
              this.render();
            }
          }
        );
        break;

      default:
        element = React.createElement<ITarefasProps>(
          Tarefas,
          {
            onSelectStage: (stage: string) => {
              this._currentView = stage as CurrentView;
              this.render();
            },
            onVoltar: undefined
          }
        );
        break;
    }

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    // Escutar evento do HomeOnboardingWebPart para navegar para tarefas
    const handleNavigateTarefas = (event: CustomEvent): void => {
      if (event.detail && event.detail.stage === 'tarefas') {
        this._currentView = 'tarefas';
        this.render();
      }
    };

    window.addEventListener('onboarding-navigate-tarefas', handleNavigateTarefas as EventListener);

    // Limpar listener quando o WebPart for destruído
    this._navigateTarefasHandler = handleNavigateTarefas as EventListener;

    return Promise.resolve();
  }

  private _navigateTarefasHandler?: EventListener;

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    // Remover listener de eventos
    if (this._navigateTarefasHandler) {
      window.removeEventListener('onboarding-navigate-tarefas', this._navigateTarefasHandler);
    }
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
