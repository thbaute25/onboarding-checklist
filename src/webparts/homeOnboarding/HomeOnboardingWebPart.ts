import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'HomeOnboardingWebPartStrings';
import Home from '../checklistOnboarding/components/Home';
import { IHomeProps } from '../checklistOnboarding/components/IHomeProps';
import ChatDuvidas from '../checklistOnboarding/components/ChatDuvidas';
import { IChatDuvidasProps } from '../checklistOnboarding/components/IChatDuvidasProps';
import { IPowerAutomateConfig } from '../checklistOnboarding/services/PowerAutomateService';

export interface IHomeOnboardingWebPartProps {
  description: string;
  chatWebhookUrl?: string; // URL do webhook do Power Automate para notificações Teams
}

type CurrentView = 'home' | 'duvidas';

export default class HomeOnboardingWebPart extends BaseClientSideWebPart<IHomeOnboardingWebPartProps> {

  private _currentView: CurrentView = 'home';

  public render(): void {
    let element: React.ReactElement;

    switch (this._currentView) {
      case 'duvidas': {
        // Configurar Power Automate se URL estiver disponível
        const powerAutomateConfig: IPowerAutomateConfig | undefined = this.properties.chatWebhookUrl
          ? {
              chatWebhookUrl: this.properties.chatWebhookUrl,
              progressoWebhookUrl: undefined
            }
          : undefined;

        element = React.createElement<IChatDuvidasProps>(
          ChatDuvidas,
          {
            userDisplayName: this.context.pageContext.user.displayName,
            userId: this.context.pageContext.user.loginName,
            userEmail: this.context.pageContext.user.email,
            powerAutomateConfig: powerAutomateConfig,
            onVoltar: () => {
              this._currentView = 'home';
              this.render();
            }
          }
        );
        break;
      }

      case 'home':
      default:
        element = React.createElement<IHomeProps>(
          Home,
          {
            onSelectStage: (stage: string) => {
              if (stage === 'duvidas') {
                this._currentView = 'duvidas';
                this.render();
              } else if (stage === 'tarefas') {
                // Disparar evento customizado para comunicar com o ChecklistOnboardingWebPart
                const event = new CustomEvent('onboarding-navigate-tarefas', {
                  detail: { stage: 'tarefas' },
                  bubbles: true
                });
                window.dispatchEvent(event);
                
                // Tentar fazer scroll até o WebPart de Checklist se existir na página
                setTimeout(() => {
                  const checklistWebPart = document.querySelector('[data-sp-webpart-id]');
                  if (checklistWebPart) {
                    checklistWebPart.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }
            }
          }
        );
        break;
    }

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return Promise.resolve();
  }

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
            },
            {
              groupName: 'Power Automate - Notificações Teams',
              groupFields: [
                PropertyPaneTextField('chatWebhookUrl', {
                  label: 'URL do Webhook - Notificações Teams',
                  description: 'URL do Flow do Power Automate para enviar notificações para thenriquebaute@alvarezandmarsal.com. Deixe vazio se não quiser usar notificações.',
                  value: this.properties.chatWebhookUrl || ''
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

